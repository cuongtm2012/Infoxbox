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
const loanResponse = require('../domain/loanDetail.save');
const dateutil = require('../util/dateutil');

const ciccptmain = require('../domain/cicrptmain.save');

const CreditCardInfor = require('../domain/creditcardinfo.save');
const getContent = require('../util/defineitem/definecard');
const getLoanDetailInfor = require('../util/defineitem/defineLoan');
const getMSG = require('../util/getMSG');

const loan12MInforSave = require('../domain/loan12monInfo.save');

const loan5YearInfo = require('../domain/loan5yearInfo.save');

const excuteInsert = require('../services/excuteInsert.service');

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
                const sysDtim = dateutil.timeStamp();
                const workID = getIdGetway.getIPGateWay();

                console.log("outJson.outB0003~~~~~", body.data.outJson.outB0003);

                // update process status = 10 update process completed
                if (!validation.isEmptyJson(body.data.outJson.outB0003) && body.data.outJson.outB0003.errYn == "N") {
                    //update process status = 10, sucecssful recieve response from scraping service

                    /* 
                      ** Excute insert
                    */

                    // 1.Loan detail infor
                    const listLoanDetailInfor = body.data.outJson.outB0003.list[0].reportS11A.loanDetailInfo.list;
                    var seq = 1;

                    const dataConvertLoanDetail = getLoanDetailInfor.getValueLoanDetailInfor(listLoanDetailInfor);
                    const bindsLoanDetailInfor = new loanResponse(dataConvertLoanDetail, niceSessionKey, seq);
                    console.log('bindsLoanDetailInfor:', bindsLoanDetailInfor);

                    // 2.Loan 5 year infor
                    const listLoan5YInfor = body.data.outJson.outB0003.list[0].reportS11A.loan5yearInfo.list;
                    var seq3 = 0;

                    const bindlistloan5YearInfo = [];
                    _.forEach(listLoan5YInfor, res => {
                        seq3 = seq3 + 1;
                        const arrChildLoan5YInfor = [];
                        const preValLoan5YInfor = new loan5YearInfo(res, niceSessionKey, sysDtim, workID, seq3);
                        _.forEach(preValLoan5YInfor, (val, key) => {
                            arrChild2.push(val)
                        });
                        bindlistloan5YearInfo.push(arrChildLoan5YInfor)
                    });
                    console.log('bindlistLoan5YInfor:', bindlistloan5YearInfo);

                    // 3.CICRPT main
                    const listcicRptInfo = body.data.outJson.outB0003.list[0].reportS11A.cicRptInfo;
                    const listcusInfor = body.data.outJson.outB0003.list[0].reportS11A.customerInfo;

                    // msg
                    const reportS11AMSG = body.data.outJson.outB0003.list[0].reportS11A;
                    const msg = getMSG.getMSG(reportS11AMSG);

                    const objciccptmain = new ciccptmain(listcicRptInfo, listcusInfor, msg, niceSessionKey, listcusInfor.address);
                    console.log('objciccptmain:', objciccptmain);

                    /* start Credit card infor
                    ** 4.cicrpt main
                    */
                    const listcreditCardInfo = body.data.outJson.outB0003.list[0].reportS11A.creditCardInfo.list;
                    const getListContentCard = getContent.getContent(listcreditCardInfo);
                    const objCreditcardinfor = new CreditCardInfor(getListContentCard, niceSessionKey);
                    console.log('objCreditcardinfor:', objCreditcardinfor);

                    /* start loan12monInfo
                   ** 5.loan12monInfo
                   */
                    const listloan12monInfo = body.data.outJson.outB0003.list[0].reportS11A.loan12monInfo.list;

                    var seq2 = 0;

                    const bindlistloan12monInfo = [];
                    _.forEach(listloan12monInfo, res => {
                        seq2 = seq2 + 1;
                        const arrChild2 = [];
                        const preVal2 = new loan12MInforSave(res, niceSessionKey, sysDtim, workID, seq2);
                        _.forEach(preVal2, (val, key) => {
                            arrChild2.push(val)
                        });
                        bindlistloan12monInfo.push(arrChild2)
                    });
                    console.log('bindlistloan12monInfo', bindlistloan12monInfo);

                    /*
                    ** Insert Scraping service
                    */
                    excuteInsert.insertScrapingMSG(bindsLoanDetailInfor, bindlistloan5YearInfo, bindlistloan12monInfo, objciccptmain, objCreditcardinfor).then(resultMSG => {
                        console.log('insert Scraping MSG:', resultMSG);
                        if (!_.isEmpty(resultMSG)) {
                            //     // call back to stataus = 04
                            //     cicService.updateCICReportInquirySuccessful({ sysDtim, niceSessionKey }).then(() => {
                            //         console.log('call back to CICReportInquirySuccessful!');
                            //     });
                            // }

                            // update complete cic report inquiry status 10
                            cicService.updateCICReportInquiryCompleted(req.body, res).then(resultUpdated => {
                                console.log("CIC report inquiry completed!", resultUpdated);

                            });

                            /*
                            **   update translog 
                            */
                            // encrypt password
                            let password = encryptPassword.encrypt(req.body.userPw);
                            let requestParams = req.body;
                            let responseParams = body.data.outJson.outB0003;
                            let cicNo = body.data.outJson.outB0003.list[0].cicNo;
                            let scrplogid = body.data.outJson.in.thread_id.substring(0, 13);
                            let workId = getIdGetway.getIPGateWay();

                            let dataTransSave = new cicTransSave(requestParams, responseParams, scrplogid, workId, password, cicNo);
                            cicServiceRes.updateScrapingTranslog(dataTransSave).then(() => {
                                console.log("Updated to scraping transaction log B0003!");
                                return next();
                            });
                        } else {
                            cicService.updateScrpModCdHasNoResponseFromScraping(req.body, res).then(() => {
                                console.log("update SCRP_MOD_CD = 00 ");
                                return next();
                            });
                        }

                        // End insert Scraping MSG
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