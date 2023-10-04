import { verifySignUp, authJwt } from "../middleware/index.js";
import { signup, 
    signin, 
    info, 
    new_token,
    logout, 
} from './../controllers/auth.controller.js';

export default function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/signup",
        [verifySignUp.checkDuplicateUsernameOrEmail,],
        signup
    );

    app.post("/signin", signin);
    app.post("/signin/new_token", new_token);
    app.get(
        "/info", 
        [authJwt.verifyToken],
        info
    );

    app.get(
        "/logout", 
        [authJwt.verifyToken],
        logout
    );
};
