const cicService = require('../services/cicInternal.service');
const validation = require('../../shared/util/validation');
const decrypt = require('../util/encryptPassword');
const URI = require('../../shared/URI');
const dateutil = require('../util/dateutil');
const defaultParams = require('../domain/defaultParams.request');
const _ = require('lodash');

const cicB0003Req = require('../domain/cicB0003.request');

const axios = require('axios');

module.exports = class internalJob {
    //Cron request internal scraping
    cron(oncomplete) {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }, timeout: 60 * 3 * 1000
        }

        cicService.startProcessB0003().then(data => {
            // Get each object in array data
            // if (validation.isEmptyJson(data)) {
            if (_.isEmpty(data)) {
                console.log('No request!');
                // return next();
                oncomplete(0, 0)
                // return;
            } else {

                // var count = 0;
                // var maxLength = data.length;

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

                // data.forEach(element => {
                // let fnData = data[i].child;
                // console.log("element::::", element);
                // let inqDt1 = dateutil.getDate();
                // let inqDt2 = dateutil.getDate();

                // DEBUG
                let inqDt1 = '20190125';
                let inqDt2 = '20190125';

                let defaultValue = defaultParams.defaultParams(inqDt1, inqDt2, '', '');

                //Convert data to format cic site
                //decrypt password
                // let decryptPW = decrypt.decrypt(element.LOGIN_PW);
                let listCicNo = listCicId.substr(0, listCicId.length - 1);
                let fnData = new cicB0003Req(listCicNo, listNiceSessionkey, data, defaultValue);

                if (!_.isEmpty(listCicNo)) {
                    cicService.updateScrpModCdPreRequestToScraping(listNiceSessionkey).then(() => {
                        axios.post(URI.internal_cicB0003, fnData, config)
                            .then((body) => {
                                // console.log("body resultB0003~~~~~", body.outJson.outB0003.reportS11A.loanDetailInfo);
                                // count++;
                                // next process until data ending
                                oncomplete(0, 0);
                                // return res.status(200).json(body.data);

                            }).catch((error) => {
                                console.log("error call to internal_cic url B0003~~", error);
                                cicService.updateCICReportInquiryReadyToRequestScraping(listNiceSessionkey).then(() => {
                                    console.log("B0003 update SCRP_MOD_CD = 00 ");
                                    return;
                                });
                                throw error;
                            });
                    });
                }
            }
            // });
        }).catch((error) => {
            console.log(error)
        });
    }
}