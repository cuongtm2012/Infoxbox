const cicB0002Req = require('../domain/cicB0002.request');

const axios = require('axios');

const URI = require('../../shared/URI');

const cicService = require('../services/cicInternal.service');

const validation = require('../../shared/util/validation');
const decrypt = require('../util/encryptPassword');

const defaultParams = require('../domain/defaultParams.request');

const dateutil = require('../util/dateutil');


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
                axios.post(URI.internal_cic, fnData, config)
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