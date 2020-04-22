const cicService = require('../services/cicInternal.service');
const URI = require('../../shared/URI');
const defaultParams = require('../../shared/domain/defaultParams.request');
const _ = require('lodash');
const CICA0001Request = require('../domain/cicA0001.request');
const axios = require('axios');
const runRestartPm2 = require('../util/runShellScript');
const util = require('../../shared/util/util');
const convertBase64 = require('../../shared/util/convertBase64ToText');
const cicMobileService = require('../services/cicMobile.service');
const io = require('socket.io-client');
const dateutil = require('../util/dateutil');
module.exports = class internalJob {
    //Cron request internal scraping
    cron(oncomplete) {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
            , timeout: 60 * 1 * 1000
        }

        //conneciton socket
        const socket = io.connect(URI.socket_url, { secure: true, rejectUnauthorized: false });

        cicService.selectExcuteA0001().then(data => {
            // Get each object in array data
            if (_.isEmpty(data)) {
                // close connection socket
                socket.close();
                // console.log('No request!');
                oncomplete(0, 0);
            } else {

                var count = 0;
                var maxLength = data.length;
                console.log("maxLength11~~~", maxLength);

                data.forEach(element => {
                    const listNiceSessionKey = [];
                    listNiceSessionKey.push(element.NICE_SSIN_ID);

                    let defaultValue = defaultParams.defaultParams('', '', '', '', '');

                    //Convert data to format cic site
                    //decrypt password yyyymmddhhmmssPassword
                    let decryptPW;
                    let _decryptPW = convertBase64.convertBase64ToText(element.LOGIN_PW);
                    if (14 < _decryptPW.length)
                        decryptPW = _decryptPW.substr(14);
                    else
                        decryptPW = _decryptPW;

                    const loginID = util.convertPhoneNumber(element.LOGIN_ID);

                    var fnData = new CICA0001Request(element, defaultValue, loginID, decryptPW);
                    console.log('request to scrap params:', fnData);

                    cicService.updateScrpModCdPreRequestToScraping(listNiceSessionKey).then(() => {

                        axios.post(URI.internal_cicMobile, fnData, config)
                            .then((body) => {
                                console.log("body resultA0001!", body.data);

                                count++;
                                // next process until data ending
                                oncomplete(count, maxLength);

                            }).catch((error) => {
                                console.log("error call to internal_cic url A0001!", error);

                                // emit socket
                                socket.emit('Internal_message', { responseTime: dateutil.getTimeHours(), niceSessionKey: element.NICE_SSIN_ID, responseMessage: 'A0001 Error Internal Batch' });

                                cicMobileService.updateScrpModCdTryCntHasNoResponseFromScraping06(element.NICE_SSIN_ID).then(() => {
                                    console.log("update SCRP_MOD_CD = 06 ");
                                    // Restart internal
                                    runRestartPm2.restartInternal();
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