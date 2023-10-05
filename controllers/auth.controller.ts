import db from '../models/index';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  verifyRefresh,
  jwtSignAccessToken,
  jwtSignRefreshToken,
  regexExp,
  validatePassword,
} from '../helper/helper';
import { invalidatedTokens } from '../config/jwtBlacklist.config';
import {Request, Response} from 'express';
import type { JwtPayload } from "jsonwebtoken";

type DecodedTokenType = {
  id: string;
}

const User = db.user;
export function signup(req: Request, res: Response) {
  const { id, password } = req.body;

  if (!password) {
    res.status(400).send({ message: 'Password is not provided' });
    return;
  }

  if (!validatePassword(password)) {
    res.status(400).send({ message: 'Password is not valid' });
    return;
  }

  const isValidEmail = regexExp.test(req.body.id); // true

  if (!isValidEmail) {
    return res.status(400).send({ message: "ID is not valid" });
  }
  const hashedPassword = bcrypt.hashSync(password, 8);
  User.create({ id, password: hashedPassword })
    .then(user => {
      const accessToken = jwtSignAccessToken(user.dataValues.id);
      const refreshToken = jwtSignRefreshToken(user.dataValues.id);
      res.status(200).send({
        accessToken,
        refreshToken
      });
    })
    .catch(err => {
      res.status(500).send({ message: err });
    });
};

export function signin(req: Request, res: Response) {
  const { id, password } = req.body;

  if (!id) {
    res.status(400).send({ message: 'ID is not provided' });
    return;
  }

  if (!password) {
    res.status(400).send({ message: 'Password is not provided' });
    return;
  }

  User.findOne({ where: { id } })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      const isPasswordValid = bcrypt.compareSync(
        password,
        user.dataValues.password
      );
      if (!isPasswordValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const accessToken = jwtSignAccessToken(user.dataValues.id);
      const refreshToken = jwtSignRefreshToken(user.dataValues.id);
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

export function new_token(req: Request, res: Response) {
  const { refreshToken } = req.body;

  const decoded = jwt.decode(refreshToken) as JwtPayload;

  if (!decoded.id) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid token, missing id" });
  }

  const isValid = verifyRefresh(decoded.id, refreshToken);

  if (!isValid) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid token,try login again" });
  }

  const accessToken = jwtSignAccessToken(decoded.id);
  const newRefreshToken = jwtSignRefreshToken(decoded.id);
  return res.status(200).send({
    accessToken,
    refreshToken: newRefreshToken
  });
}

export function info(req: Request, res: Response) {
  const authHeader = req.header("authorization");
  const bearerToken = authHeader.split(' ')[1];
  const decoded = jwt.decode(bearerToken) as JwtPayload;

  return res
    .status(200)
    .json({ id: decoded.id });
}

export function logout(req: Request, res: Response) {
  const authHeader = req.header("authorization");
  const bearerToken = authHeader.split(' ')[1];
  const decoded = jwt.decode(bearerToken) as JwtPayload;
  
  const newRefreshToken = jwtSignRefreshToken(decoded.id); 
  invalidatedTokens.add(bearerToken);

  return res.status(200).send({
    refreshToken: newRefreshToken
  });
}