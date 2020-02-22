const cicService = require('../services/cicInternal.service');
const URI = require('../../shared/URI');
const defaultParams = require('../domain/defaultParams.request');
const _ = require('lodash');
const convertBase64 = require('../../shared/util/convertBase64ToText');

const cicB1003Req = require('../domain/cicB1003.request');

const axios = require('axios');

module.exports = class internalJob {
    //Cron request internal scraping
    cron(oncomplete) {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }, timeout: 60 * 3 * 1000
        }

        cicService.startProcessB1003().then(data => {
            if (_.isEmpty(data)) {
                console.log('No request!');
                oncomplete(0, 0);
            } else {
                var count = 0;
                var maxLength = data.length;
                console.log("maxLength11~~~", maxLength);

                data.forEach(element => {
                    let inqDt1 = element.INQ_DTIM.substring(0, 8);
                    let inqDt2 = element.INQ_DTIM.substring(0, 8);

                    let defaultValue = defaultParams.defaultParams(inqDt1, inqDt2, '', '', '');

                    //Convert data to format cic site
                    //decrypt password yyyymmddhhmmssPassword
                    let decryptPW;
                    let _decryptPW = convertBase64.convertBase64ToText(element.LOGIN_PW);
                    if (14 < _decryptPW.length)
                        decryptPW = _decryptPW.substr(14);
                    else
                        decryptPW = _decryptPW;

                    var fnData = new cicB1003Req(element, defaultValue, decryptPW);

                    cicService.updateScrpModCdPreRequestToScrapingB0002(element.NICE_SSIN_ID).then(() => {
                        // "?inJsonList=%5B" + querystrings + "%5D"
                        axios.post(URI.internal_cicB0003, fnData, config)
                            .then((body) => {
                                console.log("body resultB1003~~~~~", body.data);

                                count++;
                                // next process until data ending
                                oncomplete(count, maxLength);
                                // return res.status(200).json(body.data);

                            }).catch((error) => {
                                console.log("error call to internal_cic url B1003~~", error);
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