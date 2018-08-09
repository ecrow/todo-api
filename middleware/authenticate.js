const { User }  = require('./../models/user');

const authenticate = (req, res, next) => {
    const token = req.header('x-auth');
    User.findByToken(token).then((user) => {
        if (!user) {
            res.status(404).send({ message: 'No user found' });
        }
        req.user = user;
        req.token = token;
        next();

    }).catch((err) => {
        res.status(401).send({ message: 'Non authenticated' });
    });
}

module.exports = { authenticate }