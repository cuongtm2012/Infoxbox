const cicService = require('../services/cicInternal.service');
const URI = require('../../shared/URI');
const dateutil = require('../util/dateutil');
const defaultParams = require('../../shared/domain/defaultParams.request');
const _ = require('lodash');
const convertBase64 = require('../../shared/util/convertBase64ToText');
const processRunTime = require('../../shared/util/processRunTime');

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

                    // Update for try again Naltid, Old_naltId, Passportnumber
                    let runTimeValue = processRunTime.getProcessRunTime(element);
                    console.log('runTimeValue:', runTimeValue);

                    var fnData = new cicB0002Req(element, defaultValue, decryptPW, runTimeValue);

                    cicService.updateScrpModCdPreRequestToScrapingB0002(element.NICE_SSIN_ID, runTimeValue).then(() => {

                        axios.post(URI.internal_cic, fnData, config)
                            .then((body) => {
                                console.log("body resultB0002~~~~~", body.data);

                                count++;
                                // next process until data ending
                                oncomplete(count, maxLength);

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