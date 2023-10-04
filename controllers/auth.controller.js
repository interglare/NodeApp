import db from './../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { verifyRefresh } from './../helper/helper.js';
import { invalidatedTokens } from './../config/jwtBlacklist.config.js';

const User = db.user;

export function signup (req, res) {
  let pass = bcrypt.hashSync(req.body.password, 8);
  User.create({
    id: req.body.id,
    password: pass
  })
    .then(user => {
      const accessToken = jwt.sign(
        { id: user.dataValues.id },
        "accessSecret",
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: 600, // 10 min
        });
      const refreshToken = jwt.sign(
        { id: user.dataValues.id },
        "refreshSecret",
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: 3600, // 1 hour
        });
      res.status(200).send({
        id: user.id,
        accessToken,
        refreshToken
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

export function signin (req, res) {
  User.findOne({
    where: {
      id: req.body.id
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.dataValues.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const accessToken = jwt.sign(
        { id: user.dataValues.id },
        "accessSecret",
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: 600, // 10 min
        });
      const refreshToken = jwt.sign(
        { id: user.dataValues.id },
        "refreshSecret",
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: 3600, // 1 hour
        });
      res.status(200).send({
        id: user.id,
        accessToken,
        refreshToken
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

export function new_token (req, res) {
  const { refreshToken } = req.body;
  const authHeader = req.header("authorization");
  const bearerToken = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.decode(bearerToken);
  } catch (error) {
    // console.error(error);
  }
  if (!decoded.id) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid token,missing id" });
  }
  const isValid = verifyRefresh(decoded.id, refreshToken);
  if (!isValid) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid token,try login again" });
  }
  const accessToken = jwt.sign(
    { id: decoded.id },
    "accessSecret",
    {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 600, // 10 min
    });
  const newRefreshToken = jwt.sign(
    { id: decoded.id },
    "refreshSecret",
    {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 3600, // 1 hour
    });
  return res.status(200).send({
    accessToken,
    refreshToken: newRefreshToken
  });
}

export function info(req, res) {
  const authHeader = req.header("authorization");
  const bearerToken = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.decode(bearerToken);
    return res
      .status(200)
      .json({ id: decoded.id });
  } catch (error) {
    return res
      .status(500)
      .json({ error });
  }
}

export function logout(req, res) {
  const authHeader = req.header("authorization");
  const bearerToken = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.decode(bearerToken);
  } catch (error) {
    // console.error(error);
  }
  if (!decoded.id) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid token,missing id" });
  }
  const newRefreshToken = jwt.sign(
    { id: decoded.id },
    "refreshSecret",
    {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 3600, // 1 hour
    });
    invalidatedTokens.add(bearerToken);
  return res.status(200).send({
    refreshToken: newRefreshToken
  });
}