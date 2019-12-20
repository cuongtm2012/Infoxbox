const cicB0002Req = require('../domain/cicB0002.request');

const axios = require('axios');

const URI = require('../../shared/URI');

const cicService = require('../services/cicInternal.service');

const validation = require('../../shared/util/validation');
const decrypt = require('../util/encryptPassword');

const defaultParams = require('../domain/defaultParams.request');

const dateutil = require('../util/dateutil');

// Validate parameters
// exports.validate = (method) => {
//     switch (method) {
//         case 'cicB0001': {
//             return [
//                 body('appCd', 'appCd does not exists').exists(),
//                 body('orgCd', 'orgCd does not exists').exists(),
//                 body('svcCd', 'svcCd does not exists').exists(),
//                 body('userId', 'userId does not exists').exists(),
//                 body('userPw', 'userPw does not exists').exists()
//             ]
//         }
//     }
// };

exports.cicB0002 = function (req, res, next) {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     res.status(422).json({ errors: errors.array() });
        //     return;
        // }

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
        axios.post(URI.cicInternalJson, req.body, config)
            .then((body) => {
                // console.log("body result~~~~~", body.data);

                // update process status = 9 update process completed
                if (!validation.isEmptyJson(body.data.outJson.outB0001) && body.data.outJson.outB0001.errYn == "N") {
                    //update process status = 9, sucecssful send request to cic server
                    cicService.updateCICReportInquirySuccessful(req.body, res).then(resultUpdated => {
                        console.log("CIC report inquiry successful!");
                        //TODO Update response to table
                    });
                } else {
                    return next(body);

                }

                return res.status(200).json(body.data);

            }).catch((error) => {
                console.log(error)
            });

    } catch (err) {
        return next(err)
    }
};

exports.InternalCICB0002 = function (req, res, next) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        cicService.select01(req, res).then(data => {
            // Get each object in array data
            if (validation.isEmptyJson(data)) {
                console.log('No request!');
                return next();
            }
            data.forEach(element => {
                // let fnData = data[i].child;
                console.log("element::::", element);
                let inqDt1 = dateutil.getDate();
                let inqDt2 = dateutil.getDate();

                let defaultValue = defaultParams.defaultParams(inqDt1, inqDt2, '', '');

                //Convert data to format cic site
                //decrypt password
                var decryptPW = decrypt.decrypt(element.LOGIN_PW);
                var fnData = new cicB0002Req(element, defaultValue, decryptPW);

                // "?inJsonList=%5B" + querystrings + "%5D"
                axios.post(URI.internal_cicB0002, fnData, config)
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

exports.InternalCICB0002NotExist = function (req, res, next) {
    try {
        cicService.select04NotExist(req, res).then(data => {
            // Get each object in array data
            if (validation.isEmptyJson(data)) {
                console.log('No request!');
                return next();
            }
            data.forEach(element => {
                // let fnData = data[i].child;
                console.log("element::::", element);

                //Updatinh Scraping target report does not exist
                cicService.updateScrapingTargetRepostNotExist(element).then(result => {
                    return next();
                });

            });
        }).catch((error) => {
            console.log(error)
        });;

    } catch (err) {
        return next(err)
    }
};