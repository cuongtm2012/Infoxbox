
const logger = require('../config/logger');
const authService = require('../services/auth.service');
const IUser = require('../domain/IUser');
const validation = require('../../shared/util/validation');

exports.login = function (req, res) {
    try {
		/*
		* Checking parameters request
		* Request data
		*/
        //End check params request

        authService.getUser(req, res).then(reslt => {
            console.log("result getUser: ", reslt[0]);

            if (!validation.isEmptyStr(reslt[0])) {
                var resdata = reslt[0];
                var userData = new IUser(resdata);

                return res.status(200).json(userData);
            } else {
                var userData = new IUser({});
                return res.status(400).json(userData);
            }

        });

    } catch (error) {
        console.log(error);
    }

};

