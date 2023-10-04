import jwt from 'jsonwebtoken';
import { invalidatedTokens } from './../config/jwtBlacklist.config.js';

function verifyToken(req, res, next){
    const authHeader = req.header("authorization");
    if (!authHeader || authHeader.length < 1) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }
    if (invalidatedTokens.has(token)) {
        return res.status(403).send({message: "Token was disabled"});
    }
    jwt.verify(token,
        "accessSecret",
        (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Unauthorized!",
                });
            }
            req.userId = decoded.id;
            next();
        });
};

const authJwt = {
    verifyToken: verifyToken,
};

export { authJwt };
