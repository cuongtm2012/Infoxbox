var jwt = require('jsonwebtoken');
var config = require('../config/config');

function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) {
        return res.status(403).send({
            auth: false,
            message: 'No token provided'
        });
    } else {
        if (token.startsWith('Bearer ')) {
            token = token.substring(7, token.length);
        }
    }
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err)
            return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });

        next();
    });
}

module.exports = verifyToken;