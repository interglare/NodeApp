import { NextFunction, Request, Response } from 'express';
import db from '../models/index';

const User = db.user;

function checkDuplicateUsernameOrEmail(req: Request, res: Response, next: NextFunction) {

    let id = req.body.id;

    if (!id) {
        return res.status(400).send({ message: "ID was not provided" });
    }
    
    User.findOne({ where: { id }})
        .then(user => {
            if (user) {
                res.status(400).send({
                    message: "Failed! Username is already in use!"
                });
                return;
            }
            next()
        })
        .catch(err => {
            res.status(500).send({
                message: err
            });
            return  
        })
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

export { verifySignUp };
