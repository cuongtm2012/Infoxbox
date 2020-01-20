const axios = require('axios');
const URI = require('../../shared/URI');
const cicService = require('../services/cicInternal.service');
const cicServiceRes = require('../services/cicInternalRes.service');
const validation = require('../../shared/util/validation');
const cicTransSave = require('../domain/cicTrans.save');
const encryptPassword = require('../util/encryptPassword');
const getIdGetway = require('../../shared/util/getIPGateWay');
const _ = require("lodash");
const logger = require('../config/logger');

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
                        let rpCicId = body.data.outJson.outB0002.cicNo;
                        let niceSessionKey = req.body.niceSessionKey;

                        let dataTransSave = new cicTransSave(requestParams, responseParams, scrplogid, workId, password, rpCicId, niceSessionKey);
                        cicServiceRes.updateScrapingTranslog(dataTransSave).then((re) => {
                            if (re) {
                                console.log("Updated to scraping transaction log!");
                                cicService.updateScrpModCdHasNoResponseFromScraping(req.body.niceSessionKey, res).then(() => {
                                    console.log("update SCRP_MOD_CD = 00 ");
                                    return next();
                                });
                            }
                            return next();
                        });



                    });
                } else {
                    cicService.updateScrpModCdHasNoResponseFromScraping(req.body.niceSessionKey, res).then(() => {
                        console.log("update SCRP_MOD_CD = 00 ");
                        return next();
                    });
                }

                return res.status(200).json(body.data);

            }).catch((error) => {
                console.log("error scraping service B0002~~", error);
                //Update ScrpModCd 00
                cicService.updateScrpModCdHasNoResponseFromScraping(req.body.niceSessionKey, res).then(() => {
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
const loanResponse = require('../domain/loanDetail.save');
const dateutil = require('../util/dateutil');

const ciccptmain = require('../domain/cicrptmain.save');

const CreditCardInfor = require('../domain/creditcardinfo.save');
const getContent = require('../util/defineitem/definecard');
const getMSG = require('../util/getMSG');

const loan12MInforSave = require('../domain/loan12monInfo.save');

const loan5YearInfo = require('../domain/loan5yearInfo.save');

const excuteInsert = require('../services/excuteInsert.service');

const getLoanDetail = require('../util/defineitem/defineLoan');

exports.internalCICB0003 = function (req, res, next) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
            // timeout: 6000
        }

        console.log(" req.body:::", req.body);
        //Logging request
        logger.debug('Log request parameters send from internal');
        logger.info(req.body);

        axios.post(URI.cicInternalJson, req.body, config)
            .then((body) => {

                // const niceSessionKey = req.body.niceSessionKey;
                const sysDtim = dateutil.timeStamp();
                const workID = getIdGetway.getIPGateWay();

                console.log("outJson.outB0003~~~~~", body.data.outJson.outB0003);
                //Logging request
                logger.debug('Log response parameters from scrapping service');
                logger.info(body.data.outJson.outB0003);

                // update process status = 10 update process completed
                if (!validation.isEmptyJson(body.data.outJson.outB0003) && body.data.outJson.outB0003.errYn == "N") {
                    //update process status = 10, sucecssful recieve response from scraping service

                    // Get customer
                    body.data.outJson.outB0003.list.forEach(list => {
                        if (!_.isEmpty(list.reportS11A)) {
                            let rpCicId = list.cicNo;
                            console.log('rpCicId:', rpCicId);
                            let listniceSessionKey = _.find(req.body.dataCic, ['CICID', rpCicId]);
                            console.log('niceSessionKey:', listniceSessionKey.NICESESSIONKEY);
                            let niceSessionKey = listniceSessionKey.NICESESSIONKEY;
                            // 3.CICRPT main
                            const listcicRptInfo = list.reportS11A.cicRptInfo;
                            const listcusInfor = list.reportS11A.customerInfo;

                            // msg
                            const reportS11AMSG = list.reportS11A;
                            const msg = getMSG.getMSG(reportS11AMSG);

                            const objciccptmain = new ciccptmain(listcicRptInfo, listcusInfor, msg, niceSessionKey, listcusInfor.address);
                            console.log('objciccptmain:', objciccptmain);

                            // end get customer

                            /* 
                              ** Excute insert
                            */

                            // 1.Loan detail infor
                            let listLoanDetail = list.reportS11A.loanDetailInfo.list;
                            let bindsLoanDetailInfor = [];

                            if (!_.isEmpty(listLoanDetail)) {
                                let result = getLoanDetail.getLoanDetail(listLoanDetail);
                                _.forEach(result, res => {
                                    let childLoanDetail = [];
                                    let result2 = getLoanDetail.getDetailLoanTerm(res);

                                    let preVal = new loanResponse(res, result2.ShortLoanTerm, result2.MidLoanTerm, result2.LongLoanTerm, result2.OtherLoanTerm, niceSessionKey, sysDtim, workID);
                                    _.forEach(preVal, (val, key) => {
                                        childLoanDetail.push(val);
                                    });
                                    bindsLoanDetailInfor.push(childLoanDetail);
                                });
                            }
                            console.log('bindsLoanDetailInfor:', bindsLoanDetailInfor);

                            // 2.Loan 5 year infor
                            let listLoan5YInfor = list.reportS11A.loan5yearInfo.list;
                            var seq3 = 0;
                            let bindlistloan5YearInfo = [];

                            if (!_.isEmpty(listLoan5YInfor)) {
                                _.forEach(listLoan5YInfor, res => {
                                    seq3 = seq3 + 1;
                                    const arrChildLoan5YInfor = [];
                                    const preValLoan5YInfor = new loan5YearInfo(res, niceSessionKey, sysDtim, workID, seq3);
                                    _.forEach(preValLoan5YInfor, (val, key) => {
                                        arrChild2.push(val)
                                    });
                                    bindlistloan5YearInfo.push(arrChildLoan5YInfor)
                                });
                            }
                            console.log('bindlistLoan5YInfor:', bindlistloan5YearInfo);

                            /* start Credit card infor
                            ** 4
                            */
                            let listcreditCardInfo = list.reportS11A.creditCardInfo.list;
                            let objCreditcardinfor;
                            if (_.isEmpty(listcreditCardInfo)) {
                                objCreditcardinfor = {};
                            } else {
                                let getListContentCard = getContent.getContent(listcreditCardInfo);
                                objCreditcardinfor = new CreditCardInfor(getListContentCard, niceSessionKey);
                            }
                            console.log('objCreditcardinfor:', objCreditcardinfor);

                            /* start loan12monInfo
                           ** 5.loan12monInfo
                           */
                            let listloan12monInfo = list.reportS11A.loan12monInfo.list;
                            var seq2 = 0;
                            let bindlistloan12monInfo = [];

                            if (!_.isEmpty(listloan12monInfo)) {
                                _.forEach(listloan12monInfo, res => {
                                    seq2 = seq2 + 1;
                                    const arrChild2 = [];
                                    const preVal2 = new loan12MInforSave(res, niceSessionKey, sysDtim, workID, seq2);
                                    _.forEach(preVal2, (val, key) => {
                                        arrChild2.push(val)
                                    });
                                    bindlistloan12monInfo.push(arrChild2)
                                });
                            }
                            console.log('bindlistloan12monInfo', bindlistloan12monInfo);

                            /*
                            ** Insert Scraping service
                            */

                            excuteInsert.insertScrapingMSG(bindsLoanDetailInfor, bindlistloan5YearInfo, bindlistloan12monInfo, objciccptmain, objCreditcardinfor).then(resultMSG => {
                                console.log('insert Scraping MSG:', resultMSG);
                                if (!_.isEmpty(resultMSG)) {
                                    // update complete cic report inquiry status 10
                                    cicService.updateCICReportInquiryCompleted(niceSessionKey).then(resultUpdated => {
                                        console.log("CIC report inquiry completed!", resultUpdated);

                                    });

                                    /*
                                    **   update translog 
                                    */
                                    // encrypt password
                                    let password = encryptPassword.encrypt(req.body.userPw);
                                    let requestParams = req.body;
                                    let responseParams = body.data.outJson.outB0003;
                                    let scrplogid = body.data.outJson.in.thread_id.substring(0, 5) + rpCicId;
                                    let workId = getIdGetway.getIPGateWay();

                                    let dataTransSave = new cicTransSave(requestParams, responseParams, scrplogid, workId, password, rpCicId, niceSessionKey);
                                    cicServiceRes.updateScrapingTranslog(dataTransSave).then(() => {
                                        console.log("Updated to scraping transaction log B0003!");
                                        return next();
                                    });
                                } else {
                                    cicService.updateScrpModCdHasNoResponseFromScraping(niceSessionKey).then(() => {
                                        console.log("B0003 update SCRP_MOD_CD = 00 ");
                                        return next();
                                    });
                                }

                                // End insert Scraping MSG
                            });
                        }
                    });

                } else {
                    cicService.updateCICReportInquiryReadyToRequestScraping(req.body.niceSessionKey, res).then(() => {
                        console.log(" B0003 update SCRP_MOD_CD = 00 ");
                        return next();
                    });
                }

                return res.status(200).json(body.data);

            }).catch((error) => {
                console.log("error scraping service B0003~~", error);
                //Update ScrpModCd 00
                cicService.updateCICReportInquiryReadyToRequestScraping(req.body.niceSessionKey).then(() => {
                    console.log(" B0003 update SCRP_MOD_CD = 00 ");
                    return next();
                });
            });

    } catch (err) {
        console.log("error internalCICB0003", err);
    }
};