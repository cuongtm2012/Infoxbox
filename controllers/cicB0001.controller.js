const cicB0001Req = require('../domain/cicB0001.request');

const axios = require('axios');

const URI = require('../shared/URI');

const qs = require('querystring');

const { validationResult, body } = require('express-validator/check');

const converJsonURL = require('../util/convertURLEndcoded');

const cicService = require('../services/cic.service');

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
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        console.log(" req.body:::", req.body);
        // var querystrings = qs.stringify(req.body).substring(0, qs.stringify(req.body).length - 1);
        var querystrings = converJsonURL.convertJsonURL(req.body);
        console.log(" querystrings:::", querystrings);

        // "?inJsonList=%5B" + querystrings + "%5D"
        axios.post(URI.cicB0001 + querystrings, config)
            .then((body) => {
                console.log("body result~~~~~", body.data);

                return res.status(200).json(body.data);

            }).catch((error) => {
                console.log(error)
            });

    } catch (err) {
        return next(err)
    }
};

exports.cicB0001Test = function (req, res, next) {
    try {

        // var data = {
        //     appCd: "infotechDev",
        //     orgCd: "cic.vn",
        //     svcCd: "B0001",
        //     dispNm: "cic.org.vn",
        //     userId: "h01663001phu",
        //     userPw: "RILO2018",
        //     customerType: "2",
        //     cicNo: "",
        //     cmtNo: "012772175",
        //     taxNo: "",
        //     reportType: "06",
        //     voteNo: "",
        //     reqStatus: "",
        //     inqDt1: "20191212",
        //     inqDt2: "20191212"

        // }
        cicService.select(req, res).then(data => {


            console.log(" data:::", data[0]);

            var fnData = new cicB0001Req(data[0]);

            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }

            // "?inJsonList=%5B" + querystrings + "%5D"
            axios.post(URI.internal_cicB0001, fnData, config)
                .then((body) => {
                    console.log("body result~~~~~", body.data);

                    return res.status(200).json(body.data);

                }).catch((error) => {
                    console.log(error)
                });
        });

    } catch (err) {
        return next(err)
    }
};