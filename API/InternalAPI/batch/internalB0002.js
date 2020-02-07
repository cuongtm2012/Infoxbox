const cicService = require('../services/cicInternal.service');
const validation = require('../../shared/util/validation');
const decrypt = require('../util/encryptPassword');
const URI = require('../../shared/URI');
const dateutil = require('../util/dateutil');
const defaultParams = require('../domain/defaultParams.request');
const _ = require('lodash');
const convertBase64 = require('../../shared/util/convertBase64ToText');

const cicB0002Req = require('../domain/cicB0002.request');

const axios = require('axios');

module.exports = class internalJob {
    //Cron request internal scraping
    cron(oncomplete) {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
            , timeout: 60 * 2 * 1000
        }

        cicService.select01().then(data => {
            // Get each object in array data
            // if (validation.isEmptyJson(data)) {
            if (_.isEmpty(data)) {
                console.log('No request!');
                // return next();
                oncomplete(0, 0)
                // return;
            } else {

                var count = 0;
                var maxLength = data.length;
                console.log("maxLength11~~~", maxLength);

                data.forEach(element => {
                    // let fnData = data[i].child;
                    console.log("element::::", element);
                    let inqDt1 = dateutil.getDate();
                    let inqDt2 = dateutil.getDate();

                    let defaultValue = defaultParams.defaultParams(inqDt1, inqDt2, '', '');

                    //Convert data to format cic site
                    //decrypt password yyyymmddhhmmssPassword
                    var decryptPW = convertBase64.convertBase64ToText(element.LOGIN_PW).substr(14);
                    var fnData = new cicB0002Req(element, defaultValue, decryptPW);

                    cicService.updateScrpModCdPreRequestToScrapingB0002(element.NICE_SSIN_ID).then(() => {
                        // "?inJsonList=%5B" + querystrings + "%5D"
                        axios.post(URI.internal_cic, fnData, config)
                            .then((body) => {
                                console.log("body resultB0002~~~~~", body.data);

                                count++;
                                // next process until data ending
                                oncomplete(count, maxLength);
                                // return res.status(200).json(body.data);

                            }).catch((error) => {
                                console.log("error call to internal_cic url B0002~~", error);
                                cicService.updateScrpModCdHasNoResponseFromScraping(element.NICE_SSIN_ID).then(() => {
                                    console.log("update SCRP_MOD_CD = 00 ");
                                    return;
                                });
                                throw error;
                            });
                    });
                });
            }
        }).catch((error) => {
            console.log(error)
        });
    }
}