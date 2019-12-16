const cicB0001Req = require('../domain/cicB0001.request');

const axios = require('axios');

const URI = require('../shared/URI');

const qs = require('querystring');

const { validationResult, body } = require('express-validator/check');

const converJsonURL = require('../util/convertURLEndcoded');

const cicService = require('../services/cic.service');

const validation = require('../util/validation');

// Validate parameters
exports.validate = (method) => {
    switch (method) {
        case 'cicB0001': {
            return [
                body('appCd', 'appCd does not exists').exists(),
                body('orgCd', 'orgCd does not exists').exists(),
                body('svcCd', 'svcCd does not exists').exists(),
                body('userId', 'userId does not exists').exists(),
                body('userPw', 'userPw does not exists').exists()
            ]
        }
    }
};

exports.cicB0001 = function (req, res, next) {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        console.log(" req.body:::", req.body);
        // var querystrings = qs.stringify(req.body).substring(0, qs.stringify(req.body).length - 1);
        // var querystrings = converJsonURL.convertJsonURL(req.body);
        // console.log(" querystrings:::", querystrings);

        // "?inJsonList=%5B" + querystrings + "%5D"
        // URI.cicB0001 + querystrings
        axios.post(URI.cicB0001Json, req.body, config)
            .then((body) => {
                console.log("body result~~~~~", body.data);

                //update trycount + 1
                cicService.updateTryCount(req.body, res).then(resultUpdated => {
                    console.log("update try count ++1:::", resultUpdated);
                })
                    .catch(err => {
                        console.log("errrrrr", err)
                    });

                // update process status = 9 update process completed
                if (!validation.isEmptyJson(body.data.outJson.outB0001) && body.data.outJson.outB0001.errYn == "N") {
                    //update process status = 9, sucecssful send request to cic server
                    cicService.updateComplete(req.body, res).then(resultUpdated => {
                        console.log("update completed proccess:::", resultUpdated);
                    });
                } else {
                    //update process status = 1, sucecssful send request to cic server
                    cicService.updateProcess(req.body, res).then(resultUpdated => {
                        console.log("sent request to cic:::", resultUpdated);
                    });

                }

                return res.status(200).json(body.data);

            }).catch((error) => {
                console.log(error)
            });

    } catch (err) {
        return next(err)
    }
};

exports.InternalCICB0001 = function (req, res, next) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        cicService.select(req, res).then(data => {
            // Get each object in array data
            if (validation.isEmptyJson(data))
                return next();
            data.forEach(element => {
                // let fnData = data[i].child;
                console.log("element::::", element);

                //Convert data to format cic site
                var fnData = new cicB0001Req(element);

                // "?inJsonList=%5B" + querystrings + "%5D"
                axios.post(URI.internal_cicB0001, fnData, config)
                    .then((body) => {
                        console.log("body result222~~~~~", body.data);

                        return res.status(200).json(body.data);

                    }).catch((error) => {
                        console.log(error)
                    });
            });
        }).catch((error) => {
            console.log(error)
        });;

    } catch (err) {
        return next(err)
    }
};