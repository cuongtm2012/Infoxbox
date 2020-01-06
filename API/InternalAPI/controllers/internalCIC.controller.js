const axios = require('axios');
const URI = require('../../shared/URI');
const cicService = require('../services/cicInternal.service');
const cicServiceRes = require('../services/cicInternalRes.service');
const validation = require('../../shared/util/validation');
const cicTransSave = require('../domain/cicTrans.save');
const encryptPassword = require('../util/encryptPassword');
const getIdGetway = require('../../shared/util/getIPGateWay');

exports.internalCIC = function (req, res, next) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
            // timeout: 6000
        }
        console.log(" req.body:::", req.body);
        axios.post(URI.cicInternalJson, req.body, config)
            .then((body) => {
                // console.log("body result~~~~~", body.data);

                // update process status = 04 update process completed
                if (!validation.isEmptyJson(body.data.outJson.outB0001) && body.data.outJson.outB0001.errYn == "N") {
                    //update process status = 04, sucecssful recieve response from scraping service
                    cicService.updateCICReportInquirySuccessful(req.body, res).then(resultUpdated => {
                        console.log("CIC report inquiry successful!");

                        //TODO Update response to table
                        // encrypt password
                        let password = encryptPassword.encrypt(req.body.userPw);
                        let requestParams = req.body;
                        let responseParams = body.data.outJson.outB0002;
                        let scrplogid = body.data.outJson.in.thread_id.substring(0, 13);
                        let workId = getIdGetway.getIPGateWay();

                        let dataTransSave = new cicTransSave(requestParams, responseParams, scrplogid, workId, password);
                        cicServiceRes.updateScrapingTranslog(dataTransSave).then(() => {
                            console.log("Updated to scraping transaction log!");
                            return next();
                        });

                    });
                } else {
                    cicService.updateScrpModCdHasNoResponseFromScraping(req.body, res).then(() => {
                        console.log("update SCRP_MOD_CD = 00 ");
                        return next();
                    });
                }

                return res.status(200).json(body.data);

            }).catch((error) => {
                console.log("error scraping service~~", error);
                //Update ScrpModCd 00
                cicService.updateScrpModCdHasNoResponseFromScraping(req.body, res).then(() => {
                    console.log("update SCRP_MOD_CD = 00 ");
                    return next();
                });
            });

    } catch (err) {
        console.log("error cicInternalJson", err);
    }
};

/*
    process B0003
*/
const loanService = require('../services/loanDetailInfo.service');
const loanResponse = require('../domain/loanDetail.response');

exports.internalCICB0003 = function (req, res, next) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
            // timeout: 6000
        }

        console.log(" req.body:::", req.body);

        axios.post(URI.cicInternalJson, req.body, config)
            .then((body) => {
                console.log("outJson.outB0003~~~~~", body.data.outJson.outB0003);

                // update process status = 10 update process completed
                if (!validation.isEmptyJson(body.data.outJson.outB0003) && body.data.outJson.outB0003.errYn == "N") {
                    //update process status = 10, sucecssful recieve response from scraping service
                    // cicService.updateCICReportInquiryCompleted(req.body, res).then(resultUpdated => {
                    //     console.log("CIC report inquiry completed!");
                    var listDataS11aB0003 = body.data.outJson.outB0003.list[0].reportS11A.loanDetailInfo.list;
                    console.log("listDataS11aB0003~~~~~", listDataS11aB0003);
                    var seqPlus = 0;
                    listDataS11aB0003.forEach(e => {
                        seqPlus = seqPlus + 1;
                        console.log('eeeeeee', e);
                        console.log('seqPlus~~~', seqPlus);
                        let loanResponseData = new loanResponse(e, req.body.niceSessionKey, seqPlus);
                        console.log('losnResponseData~~~', loanResponseData);
                        loanService.insertLoanDetailInfor(loanResponseData).then(() => {
                            console.log("Updated to tb_loan_detail !");
                            return next();
                        });
                    });
                    cicService.updateCICReportInquiryCompleted(req.body, res).then(resultUpdated => {
                        console.log("CIC report inquiry completed!", resultUpdated);
                        return;
                    });
                } else {
                    return next();
                }

                return res.status(200).json(body.data);

            }).catch((error) => {
                console.log("error scraping service~~", error);
            });

    } catch (err) {
        console.log("error cicInternalJson", err);
    }
};