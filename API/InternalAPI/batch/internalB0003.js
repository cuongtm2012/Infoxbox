const cicService = require('../services/cicInternal.service');
const URI = require('../../shared/URI');
const defaultParams = require('../../shared/domain/defaultParams.request');
const _ = require('lodash');
const convertBase64 = require('../../shared/util/convertBase64ToText');

const cicB0003Req = require('../domain/cicB0003.request');

const axios = require('axios');

const runRestartPm2 = require('../util/runShellScript');
const io = require('socket.io-client');
const dateutil = require('../util/dateutil');
module.exports = class internalJob {
    //Cron request internal scraping
    cron(oncomplete) {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }, timeout: 60 * 3 * 1000
        }
        
        //conneciton socket
        const socket = io.connect(URI.socket_url, { secure: true, rejectUnauthorized: false });

        cicService.startProcessB0003().then(resdata => {
            if (_.isEmpty(resdata)) {
                // close connection socket
                socket.close();
                // console.log('No request!');
                oncomplete(0, 0);
            } else {
                // convert data follow login_id
                const _dataByLoginId = _.chain(resdata).groupBy("LOGIN_ID").value();
                _.forEach(_dataByLoginId, data => {

                    /*
                    * Get user/ password
                    */
                    // user
                    let loginUser = data[0].LOGIN_ID;
                    //password
                    let decryptPW;
                    let _decryptPW = convertBase64.convertBase64ToText(data[0].LOGIN_PW);
                    if (14 < _decryptPW.length)
                        decryptPW = _decryptPW.substr(14);
                    else
                        decryptPW = _decryptPW;

                    //Get list cicID
                    let arrCicId = _.map(data, 'CICID');
                    let listCicId = '';

                    _.forEach(arrCicId, (val, key) => {
                        listCicId = listCicId + val + ',';
                    });
                    console.log('listCicId~~:', listCicId.substr(0, listCicId.length - 1));
                    // End get list CICID

                    //Get list nicesessionkey
                    let arrNiceSessionkey = _.map(data, 'NICESESSIONKEY');
                    let listNiceSessionkey = [];
                    let listSessionkey = '';

                    _.forEach(arrNiceSessionkey, (val, key) => {
                        listNiceSessionkey.push(val);
                        listSessionkey = listSessionkey + "'" + val + "',";
                    });
                    console.log('arrNiceSessionkey~~:', listNiceSessionkey);
                    // End get list nicesessionkey

                    let inqDt1 = data[0].INQ_DTIM.substring(0, 8);
                    let inqDt2 = data[0].INQ_DTIM.substring(0, 8);

                    let defaultValue = defaultParams.defaultParams(inqDt1, inqDt2, '', '', '');

                    //Convert data to format cic site
                    //decrypt password
                    // let decryptPW = decrypt.decrypt(element.LOGIN_PW);
                    let listCicNo = listCicId.substr(0, listCicId.length - 1);
                    let fnData = new cicB0003Req(listCicNo, listNiceSessionkey, data, defaultValue, loginUser, decryptPW);

                    if (!_.isEmpty(listCicNo)) {
                        cicService.updateScrpModCdPreRequestToScraping(listNiceSessionkey).then(() => {
                            axios.post(URI.internal_cicB0003, fnData, config)
                                .then((body) => {
                                    oncomplete(0, 0);

                                }).catch((error) => {
                                    console.log("error call to internal_cic url B0003~~", error);

                                    // emit socket
                                    socket.emit('Internal_message', { responseTime: dateutil.getTimeHours(), niceSessionKey: (listNiceSessionkey[0] + '...'), responseMessage: 'B0003 Error Internal Batch' });

                                    cicService.updateCICReportInquiryReadyToRequestScraping(listNiceSessionkey).then(() => {
                                        console.log("B0003 update SCRP_MOD_CD = 00 ");
                                        // Restart internal
                                        runRestartPm2.restartInternal();
                                    });
                                    throw error;
                                });
                        });
                    }
                });
            }
        }).catch((error) => {
            console.log(error)
        });
    }
}