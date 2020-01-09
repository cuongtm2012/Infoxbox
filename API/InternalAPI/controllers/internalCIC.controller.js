const axios = require('axios');
const URI = require('../../shared/URI');
const cicService = require('../services/cicInternal.service');
const cicServiceRes = require('../services/cicInternalRes.service');
const validation = require('../../shared/util/validation');
const cicTransSave = require('../domain/cicTrans.save');
const encryptPassword = require('../util/encryptPassword');
const getIdGetway = require('../../shared/util/getIPGateWay');
const _ = require("lodash");

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

                        cicService.updateScrpModCdHasNoResponseFromScraping(req.body, res).then(() => {
                            console.log("update SCRP_MOD_CD = 00 ");
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
                console.log("error scraping service B0002~~", error);
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
const dateutil = require('../util/dateutil');

const ciccptmain = require('../domain/cicrptmain.save');
const cicmainService = require('../services/cicMain.service');

const CreditCardInfor = require('../domain/creditcardinfo.save');
const creditcardservice = require('../services/creditcardinfor.service');
const getContent = require('../util/defineitem/definecard');
const getMSG = require('../util/getMSG');

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
                
                const niceSessionKey = req.body.niceSessionKey;

                console.log("outJson.outB0003~~~~~", body.data.outJson.outB0003);

                // update process status = 10 update process completed
                if (!validation.isEmptyJson(body.data.outJson.outB0003) && body.data.outJson.outB0003.errYn == "N") {
                    //update process status = 10, sucecssful recieve response from scraping service
                    // cicService.updateCICReportInquiryCompleted(req.body, res).then(resultUpdated => {
                    //     console.log("CIC report inquiry completed!");

                    cicService.updateCICReportInquiryCompleted(req.body, res).then(resultUpdated => {
                        console.log("CIC report inquiry completed!", resultUpdated);
                        /* start loan detail
                        ** Loan Detail
                        */
                        const listDataS11aB0003 = body.data.outJson.outB0003.list[0].reportS11A.loanDetailInfo.list;
                        console.log("listDataS11aB0003~~~~~", listDataS11aB0003);
                        console.log("listDataS11aB0003 length~~~~~", listDataS11aB0003.length);

                        // Convert data to save TB_LOAN_DETAIL

                        const sysDtim = dateutil.timeStamp();
                        const workID = getIdGetway.getIPGateWay();
                        var seq = 0;

                        const binds = [];
                        _.forEach(listDataS11aB0003, res => {
                            seq = seq + 1;
                            const arrChild = [];
                            const preVal = new loanResponse(res, niceSessionKey, sysDtim, workID, seq.toString());
                            _.forEach(preVal, (val, key) => {
                                arrChild.push(val)
                            });
                            binds.push(arrChild)
                        });
                        console.log('binds', binds);
                        // End convert

                        loanService.insertLoanDetailInfor(binds).then(() => {
                            console.log("Updated to tb_loan_detail !");

                            return next();

                        });
                        // end Loan

                        /* start cicrpt main
                        ** cicrpt main
                        */
                        const listcicRptInfo = body.data.outJson.outB0003.list[0].reportS11A.cicRptInfo;
                        const listcusInfor = body.data.outJson.outB0003.list[0].reportS11A.customerInfo;
                        console.log('listcicRptInfo~~~', listcicRptInfo);

                        // msg
                        const reportS11AMSG = body.data.outJson.outB0003.list[0].reportS11A;
                        const msg = getMSG.getMSG(reportS11AMSG);

                        const fnciccptmain = new ciccptmain(listcicRptInfo, listcusInfor, msg, niceSessionKey, listcusInfor.address);
                        console.log('fnciccptmain~~~', fnciccptmain);
                        cicmainService.insertCicMainInfor(fnciccptmain).then((r) => {
                            console.log('Insert to CICRPT_Main!!!');

                            return next();

                        });
                        //end cicrpt main

                         /* start Credit card infor
                        ** cicrpt main
                        */
                       const listcreditCardInfo = body.data.outJson.outB0003.list[0].reportS11A.creditCardInfo.list;
                       console.log('listcreditCardInfo~~~', listcreditCardInfo);
                       const getListContentCard = getContent.getContent(listcreditCardInfo);
                       console.log('getListContent~~~', getListContentCard);
                       const fncreditcardinfor = new CreditCardInfor(getListContentCard, niceSessionKey);
                       creditcardservice.insertCreditCardInfor(fncreditcardinfor).then((r) => {
                           console.log('Insert to credit card!!!');

                           return next();

                       });
                       //end credit card infor



                        /*
                        **   update translog 
                        */
                        // encrypt password
                        let password = encryptPassword.encrypt(req.body.userPw);
                        let requestParams = req.body;
                        let responseParams = body.data.outJson.outB0003;
                        let scrplogid = body.data.outJson.in.thread_id.substring(0, 13);
                        let workId = getIdGetway.getIPGateWay();

                        let dataTransSave = new cicTransSave(requestParams, responseParams, scrplogid, workId, password);
                        cicServiceRes.updateScrapingTranslog(dataTransSave).then(() => {
                            console.log("Updated to scraping transaction log B0003!");
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
                console.log("error scraping service B0003~~", error);
                //Update ScrpModCd 00
                cicService.updateScrpModCdHasNoResponseFromScraping(req.body, res).then(() => {
                    console.log("update SCRP_MOD_CD = 00 ");
                    return next();
                });
            });

    } catch (err) {
        console.log("error internalCICB0003", err);
    }
};