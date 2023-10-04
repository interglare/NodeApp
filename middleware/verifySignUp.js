import db from './../models/index.js';

const User = db.user;

function checkDuplicateUsernameOrEmail(req, res, next){
    User.findOne({
        where: {
            id: req.body.id
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Failed! Username is already in use!"
            });
            return;
        }
        next()
    });
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

export { verifySignUp };
