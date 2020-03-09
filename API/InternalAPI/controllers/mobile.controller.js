const axios = require('axios');
const URI = require('../../shared/URI');
const _ = require('lodash');
const cicMobileService = require('../services/cicMobile.service');
const cicService = require('../services/cicInternal.service');
const cicServiceRes = require('../services/cicInternalRes.service');
const cicTransA001Save = require('../domain/cicTransA0001.save');
const CicA0001Save = require('../domain/cicA0001.save');

exports.mobileCicController = function (req, res, next) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 1 * 60 * 1000
        }

        axios.post(URI.cicInternalJson, req.body, config)
            .then((body) => {
                let _dataReport, dataReportSave;

                if (_.isEqual('input captcha image', body.data.outJson.errMsg.toLowerCase())) {
                    let dataStep = body.data.outJson.step_data;
                    let imgBase64 = body.data.outJson.step_img;

                    return res.status(200).json({ imgBase64, dataStep });
                }
                else if (!_.isEmpty(body.data.outJson.outA0001) && _.isEqual('N', (body.data.outJson.outA0001.errYn))) {
                    _dataReport = JSON.parse(body.data.outJson.outA0001.list[0].dataReport);

                    dataReportSave = new CicA0001Save(_dataReport, req.body);
                    console.log('dataReportSave', dataReportSave);

                    cicMobileService.insertMobileReportA0001(dataReportSave).then(rowInsert => {
                        if (1 < rowInsert) {
                            console.log('insert successfully A0001');
                            // update complete cic report inquiry status 10
                            cicService.updateCICReportInquiryCompleted(req.body.niceSessionKey, req.body.svcCd).then(resultUpdated => {
                                console.log("CIC report inquiry completed!", resultUpdated);
                            });

                            /*
                            **   update translog 
                            */
                            // encrypt password
                            let dataTransSave = new cicTransA001Save(req.body, dataReportSave, body.data.outJson.errMsg);
                            cicServiceRes.updateScrapingTranslog(dataTransSave).then((r) => {
                                if (1 <= r)
                                    console.log("Updated to scraping transaction log A0001! successful");
                                else
                                    console.log("Updated to scraping transaction log A0001! Failured");
                            });
                        }
                        else {
                            console.log('insert failure A0001');
                            cicService.updateScrpModCdHasNoResponseFromScraping(req.body.niceSessionKey).then(() => {
                                console.log("B0003 update SCRP_MOD_CD = 00 ");
                                return next();
                            });
                        }
                    });
                    return res.status(200).json(dataReportSave);
                }
                else {
                    //TODO - update error cose
                    cicService.updateScrpModCdHasNoResponseFromScraping(req.body.niceSessionKey).then(() => {
                        console.log("B0003 update SCRP_MOD_CD = 00 ");
                        return next();
                    });
                }
            });

    } catch (err) {
        console.log("error internalCICA0001", err);
        return res.status(500).json({ error: err.toString() });
    }
}
