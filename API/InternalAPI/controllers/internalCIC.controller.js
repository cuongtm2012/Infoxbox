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
const vamcLoanInfo = require('../domain/vamcLoanInfo.save');
const loanAtt12MInfo = require('../domain/loanAttention12mInfo');
const creditContractInfor = require('../domain/creditContractInfo.save');
const customerLookupInfo = require('../domain/customerLookUpInfo.save');
const colletaralLoanSecuInfo = require('../domain/collateralLoanSecuInfo.save');
const card3yearInfo = require('../domain/card3YearInfo.save');

const excuteInsert = require('../services/excuteInsert.service');

const getLoanDetail = require('../util/defineitem/defineLoan');
const defineColletral = require('../util/defineitem/defineCollateral');
const defineCard3Year = require('../util/defineitem/defineCard3Y');

exports.internalCICB0003 = function (req, res, next) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 2 * 60 * 1000
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

                            // 2.1.Loan detail infor
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

                            // 2.5. Loan 5 year infor
                            let listLoan5YInfor = list.reportS11A.loan5yearInfo.list;
                            var seq3 = 0;
                            let bindlistloan5YearInfo = [];

                            if (!_.isEmpty(listLoan5YInfor)) {
                                _.forEach(listLoan5YInfor, res => {
                                    seq3 = seq3 + 1;
                                    const arrChildLoan5YInfor = [];
                                    const preValLoan5YInfor = new loan5YearInfo(res, niceSessionKey, sysDtim, workID, seq3);
                                    _.forEach(preValLoan5YInfor, (val, key) => {
                                        arrChildLoan5YInfor.push(val)
                                    });
                                    bindlistloan5YearInfo.push(arrChildLoan5YInfor)
                                });
                            }
                            console.log('bindlistLoan5YInfor:', bindlistloan5YearInfo);

                            /*2.2. start Credit card infor
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

                            // 2.3.Vamc loan infor
                            let listVamcLoanInfo = list.reportS11A.vamcLoanInfo.list;
                            var seqvamc = 0;
                            let bindlistVamcLoanInfo = [];

                            if (!_.isEmpty(listVamcLoanInfo)) {
                                _.forEach(listVamcLoanInfo, res => {
                                    seqvamc = seqvamc + 1;
                                    const arrChildVamcLoanInfo = [];
                                    const preValVamceLoanInfo = new vamcLoanInfo(res, niceSessionKey, sysDtim, workID, seqvamc);
                                    _.forEach(preValVamceLoanInfo, (val, key) => {
                                        arrChildVamcLoanInfo.push(val)
                                    });
                                    bindlistVamcLoanInfo.push(arrChildVamcLoanInfo)
                                });
                            }
                            console.log('bindlistVamcLoanInfo:', bindlistVamcLoanInfo);

                            /* start loan12monInfo
                           ** 2.4.loan12monInfo
                           */
                            let listloan12monInfo = list.reportS11A.loan12monInfo.list;
                            var seq2 = 0;
                            let bindlistloan12monInfo = [];

                            if (!_.isEmpty(listloan12monInfo)) {
                                _.forEach(listloan12monInfo, res => {
                                    seq2 = seq2 + 1;
                                    const arrChildLoan12MonInfo = [];
                                    const preVal2 = new loan12MInforSave(res, niceSessionKey, sysDtim, workID, seq2);
                                    _.forEach(preVal2, (val, key) => {
                                        arrChildLoan12MonInfo.push(val)
                                    });
                                    bindlistloan12monInfo.push(arrChildLoan12MonInfo)
                                });
                            }
                            console.log('bindlistloan12monInfo', bindlistloan12monInfo);

                            /* 
                           ** 2.6. Card 3 Year
                           */
                            let listCard3YearInfo = list.reportS11A.credit3yearInfo.list;
                            let objCard3YearInfo;
                            if (_.isEmpty(listCard3YearInfo)) {
                                objCard3YearInfo = {};
                            }
                            else {
                                let getCard3Year = defineCard3Year.getCard3YInfor(listCard3YearInfo);
                                objCard3YearInfo = new card3yearInfo(getCard3Year, niceSessionKey);
                            }
                            console.log('objCard3YearInfo:', objCard3YearInfo);

                            /* 
                            ** 2.7.Loan Attention 12M info
                            */
                            let listloanAtt12monInfo = list.reportS11A.loanAttention12monInfo.list;
                            var seqAttLoan = 0;
                            let bindlistloanAtt12monInfo = [];

                            if (!_.isEmpty(listloanAtt12monInfo)) {
                                _.forEach(listloanAtt12monInfo, res => {
                                    seqAttLoan = seqAttLoan + 1;
                                    const arrChildLoanAtt12MonInfo = [];
                                    const preVal2 = new loanAtt12MInfo(res, niceSessionKey, sysDtim, workID, seqAttLoan);
                                    _.forEach(preVal2, (val, key) => {
                                        arrChildLoanAtt12MonInfo.push(val)
                                    });
                                    bindlistloanAtt12monInfo.push(arrChildLoanAtt12MonInfo)
                                });
                            }
                            console.log('bindlistloanAtt12monInfo', bindlistloanAtt12monInfo);

                            /* 
                            ** 3.2. Credit contract info
                            */
                            let listcreditContractInfo = list.reportS11A.creditContractInfo.list;
                            var seqcreditCtr = 0;
                            let bindlistCreditContractInfo = [];

                            if (!_.isEmpty(listcreditContractInfo)) {
                                _.forEach(listcreditContractInfo, res => {
                                    seqcreditCtr = seqcreditCtr + 1;
                                    const arrChildCreditContractInfo = [];
                                    const preVal2 = new creditContractInfor(res, niceSessionKey, sysDtim, workID, seqcreditCtr);
                                    _.forEach(preVal2, (val, key) => {
                                        arrChildCreditContractInfo.push(val)
                                    });
                                    bindlistCreditContractInfo.push(arrChildCreditContractInfo)
                                });
                            }
                            console.log('bindlistCreditContractInfo', bindlistCreditContractInfo);


                            /* 
                            ** 3.3. Customer lookup info
                            */
                            let listcusLookupInfo = list.reportS11A.customerLookUpInfo.list;
                            var seqcusLook = 0;
                            let bindlistcusLookupInfo = [];

                            if (!_.isEmpty(listcusLookupInfo)) {
                                _.forEach(listcusLookupInfo, res => {
                                    seqcusLook = seqcusLook + 1;
                                    const arrChildCusLookUpInfo = [];
                                    const preVal2 = new customerLookupInfo(res, niceSessionKey, sysDtim, workID, seqcusLook);
                                    _.forEach(preVal2, (val, key) => {
                                        arrChildCusLookUpInfo.push(val)
                                    });
                                    bindlistcusLookupInfo.push(arrChildCusLookUpInfo)
                                });
                            }
                            console.log('bindlistcusLookupInfo', bindlistcusLookupInfo);

                            /* 
                            ** 3.1. Colletaral Loan Secu info
                            */
                            let listloanSecurityInfo = list.reportS11A.loanSecurityInfo.list;
                            let objCollateralInfo;
                            if (_.isEmpty(listloanSecurityInfo)) {
                                objCollateralInfo = {};
                            }
                            else {
                                let getCard3Year = defineColletral.getCollateral(listloanSecurityInfo);
                                objCollateralInfo = new colletaralLoanSecuInfo(getCard3Year, niceSessionKey);
                            }
                            console.log('objCollateralInfo:', objCollateralInfo);

                            /*
                            ** Insert Scraping service
                            */

                            excuteInsert.insertScrapingMSG(bindsLoanDetailInfor, bindlistloan5YearInfo, bindlistloan12monInfo, objciccptmain, objCreditcardinfor, bindlistVamcLoanInfo, bindlistloanAtt12monInfo, bindlistCreditContractInfo, bindlistcusLookupInfo, objCollateralInfo, objCard3YearInfo).then(resultMSG => {
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