import { verifySignUp, authJwt } from "../middleware/index.js";
import { signup, 
    signin, 
    info, 
    new_token,
    logout, 
} from './../controllers/auth.controller.js';
import express from 'express';

export const authRoute = express.Router();

authRoute.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

authRoute.post(
    "/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail,],
    signup
);

authRoute.post("/signin", signin);
authRoute.post("/signin/new_token", new_token);
authRoute.get(
    "/info", 
    [authJwt.verifyToken],
    info
);

authRoute.get(
    "/logout", 
    [authJwt.verifyToken],
    logout
);
