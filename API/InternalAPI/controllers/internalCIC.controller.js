const axios = require('axios');
const URI = require('../../shared/URI');
const cicService = require('../services/cicInternal.service');
const cicServiceRes = require('../services/cicInternalRes.service');
const cicTransSave = require('../domain/cicTrans.save');
const encryptPassword = require('../util/encryptPassword');
const getIdGetway = require('../../shared/util/getIPGateWay');
const _ = require("lodash");
const logger = require('../config/logger');
const responCode = require('../../shared/constant/responseCodeExternal');
const convertPassword = require('../../shared/util/convertBase64ToText');

exports.internalCIC = function (req, res, next) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
            // timeout: 6000
        }
        console.log(" req.body:::", req.body);

        //Logging request
        logger.debug('Log request parameters send from internal B0002');
        logger.info(req.body);

        axios.post(URI.cicInternalJson, req.body, config)
            .then((body) => {
                let niceSessionKey = req.body.niceSessionKey;

                //Logging response
                logger.debug('Log response parameters from scrapping service B0002');
                logger.info(body.data);

                if (_.isEqual('input captcha image', body.data.outJson.errMsg.toLowerCase())) {
                    let dataStep = body.data.outJson.step_data;
                    let imgBase64 = body.data.outJson.step_img;

                    return res.status(200).json({ imgBase64, dataStep });
                }

                // update process status = 04 update process completed
                else if (!_.isEmpty(body.data.outJson.outB0002.cicNo) && _.isEqual("N", body.data.outJson.outB0002.errYn)) {
                    //update process status = 04, sucecssful recieve response from scraping service
                    cicService.updateCICReportInquirySuccessful(req.body, res).then(resultUpdated => {
                        console.log("CIC report inquiry successful!");

                        // encrypt password
                        let password = convertPassword.convertTextToBase64(req.body.userPw);
                        let requestParams = req.body;
                        let responseParams = body.data.outJson.outB0002;
                        let scrplogid = body.data.outJson.in.thread_id.substring(0, 13);
                        let workId = getIdGetway.getIPGateWay();
                        let rpCicId = body.data.outJson.outB0002.cicNo;

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
                    // Log in error
                    if (utilFunction.checkStatusCodeScraping(responCode.ScrappingResponseCodeLoginFailure, body.data.outJson.errMsg)) {
                        if (0 <= _.indexOf([responCode.ScrappingResponseCodeLoginFailure.LoginFail1.code, responCode.ScrappingResponseCodeLoginFailure.LoginFail2.code, responCode.ScrappingResponseCodeLoginFailure.LoginFail6.code], utilFunction.getStatusScrappingCode(body.data.outJson.errMsg))) {
                            cicService.updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.CICSiteAccessFailure.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.LoginInError.code + '-' + responCode.RESCODEEXT.CICSiteAccessFailure.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        }
                        else if (0 <= _.indexOf([responCode.ScrappingResponseCodeLoginFailure.LoginFail3.code, responCode.ScrappingResponseCodeLoginFailure.LoginFail4.code, responCode.ScrappingResponseCodeLoginFailure.LoginFail5.code], utilFunction.getStatusScrappingCode(body.data.outJson.errMsg))) {
                            cicService.updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.CICSiteLoginFailure.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.LoginInError.code + '-' + responCode.RESCODEEXT.CICSiteLoginFailure.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        }
                        else if (0 <= _.indexOf([responCode.ScrappingResponseCodeLoginFailure.LoginFail7.code], utilFunction.getStatusScrappingCode(body.data.outJson.errMsg))) {
                            cicService.updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.S37ReportScreenAccsError.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.LoginInError.code + '-' + responCode.RESCODEEXT.S37ReportScreenAccsError.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        } else {
                            cicService.updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.ETCError.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.LoginInError.code + '-' + responCode.RESCODEEXT.ETCError.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        }
                    }
                    // CIC ID inquiry error
                    else if (utilFunction.checkStatusCodeScraping(responCode.ScrappingResponseCodeCicINQError, body.data.outJson.outB0001.errMsg) || utilFunction.checkStatusCodeScraping(responCode.ScrappingResponseCodeCicINQError, body.data.outJson.errMsg)) {
                        if (0 <= _.indexOf([responCode.ScrappingResponseCodeCicINQError.CicIdINQError1.code, responCode.ScrappingResponseCodeCicINQError.CicIdINQError2.code], utilFunction.getStatusScrappingCode(body.data.outJson.outB0001.errMsg, body.data.outJson.errMsg))) {
                            cicService.updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, responCode.ScrapingStatusCode.CicIdInqError.code, responCode.RESCODEEXT.CICSiteAccessFailure.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.CicIdInqError.code + '-' + responCode.RESCODEEXT.CICSiteAccessFailure.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        } else if (0 <= _.indexOf([responCode.ScrappingResponseCodeCicINQError.CicIdINQError3.code], utilFunction.getStatusScrappingCode(body.data.outJson.outB0001.errMsg, body.data.outJson.errMsg))) {
                            if (req.body.totalCount == req.body.trycount) {
                                cicService.updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, responCode.ScrapingStatusCode.CicIdInqError.code, responCode.RESCODEEXT.NoMatchingCICIDWithNalID.code).then(rslt => {
                                    if (1 <= rslt)
                                        console.log('Update scraping status:' + responCode.ScrapingStatusCode.CicIdInqError.code + '-' + responCode.RESCODEEXT.NoMatchingCICIDWithNalID.code);
                                    else
                                        console.log('Update scraping status failure!');
                                });
                            } else {
                                //Update ScrpModCd 00
                                cicService.updateScrpModCdHasNoResponseFromScraping(req.body.niceSessionKey, res).then(() => {
                                    console.log("update SCRP_MOD_CD = 00 ");
                                    return next();
                                });
                            }
                        } else if (0 <= _.indexOf([responCode.ScrappingResponseCodeCicINQError.CicIdINQError4.code], utilFunction.getStatusScrappingCode(body.data.outJson.outB0001.errMsg, body.data.outJson.errMsg))) {
                            cicService.updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, responCode.ScrapingStatusCode.CicIdInqError.code, responCode.RESCODEEXT.CaptchaProcessFailure.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.CicIdInqError.code + '-' + responCode.RESCODEEXT.CaptchaProcessFailure.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        }
                    }
                    // CIC report inquiry error
                    else if (utilFunction.checkStatusCodeScraping(responCode.ScrappingResponseCodeCicReportINQError, body.data.outJson.outB0002.errMsg) || utilFunction.checkStatusCodeScraping(responCode.ScrappingResponseCodeCicReportINQError, body.data.outJson.errMsg)) {
                        if (0 <= _.indexOf([responCode.ScrappingResponseCodeCicReportINQError.CicReportINQError1.code, responCode.ScrappingResponseCodeCicReportINQError.CicReportINQError2.code
                            , responCode.ScrappingResponseCodeCicReportINQError.CicReportINQError102.code, responCode.ScrappingResponseCodeCicReportINQError.CicReportINQError103.code
                            , responCode.ScrappingResponseCodeCicReportINQError.CicReportINQError104.code, responCode.ScrappingResponseCodeCicReportINQError.CicReportINQError105.code
                            , responCode.ScrappingResponseCodeCicReportINQError.CicReportINQError106.code], utilFunction.getStatusScrappingCode(body.data.outJson.outB0002.errMsg, body.data.outJson.errMsg))) {
                            cicService.updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, responCode.ScrapingStatusCode.CicReportInqError.code, responCode.RESCODEEXT.CICReportInqReqFaliure.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.CicReportInqError.code + '-' + responCode.RESCODEEXT.CICReportInqReqFaliure.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        } else if (0 <= _.indexOf([responCode.ScrappingResponseCodeCicReportINQError.CicReportINQError3.code, responCode.ScrappingResponseCodeCicReportINQError.CicReportINQError201.code], utilFunction.getStatusScrappingCode(body.data.outJson.outB0002.errMsg, body.data.outJson.errMsg))) {
                            if (req.body.totalCount == req.body.trycount) {
                                cicService.updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, responCode.ScrapingStatusCode.CicIdInqError.code, responCode.RESCODEEXT.NoMatchingCICIDWithNalID.code).then(rslt => {
                                    if (1 <= rslt)
                                        console.log('Update scraping status:' + responCode.ScrapingStatusCode.CicIdInqError.code + responCode.RESCODEEXT.NoMatchingCICIDWithNalID.code);
                                    else
                                        console.log('Update scraping status failure!');
                                });
                            } else {
                                //Update ScrpModCd 00
                                cicService.updateScrpModCdHasNoResponseFromScraping(req.body.niceSessionKey, res).then(() => {
                                    console.log("update SCRP_MOD_CD = 00 ");
                                    return next();
                                });
                            }
                        }
                        else if (0 <= _.indexOf([responCode.ScrappingResponseCodeCicReportINQError.CicReportINQError101.code], utilFunction.getStatusScrappingCode(body.data.outJson.outB0002.errMsg, body.data.outJson.errMsg))) {
                            if (req.body.totalCount == req.body.trycount) {
                                cicService.updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, responCode.ScrapingStatusCode.CicIdInqError.code, responCode.RESCODEEXT.NotUniquePersonInCIC.code).then(rslt => {
                                    if (1 <= rslt)
                                        console.log('Update scraping status:' + responCode.ScrapingStatusCode.CicIdInqError.code + responCode.RESCODEEXT.NotUniquePersonInCIC.code);
                                    else
                                        console.log('Update scraping status failure!');
                                });
                            } else {
                                //Update ScrpModCd 00
                                cicService.updateScrpModCdHasNoResponseFromScraping(req.body.niceSessionKey, res).then(() => {
                                    console.log("update SCRP_MOD_CD = 00 ");
                                    return next();
                                });
                            }
                        } else if (0 <= _.indexOf([responCode.ScrappingResponseCodeCicReportINQError.CicReportINQError107.code], utilFunction.getStatusScrappingCode(body.data.outJson.outB0002.errMsg, body.data.outJson.errMsg))) {
                            cicService.updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, responCode.ScrapingStatusCode.CicReportInqError.code, responCode.RESCODEEXT.DuplicateAppOfCICReportADay.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.CicReportInqError.code + responCode.RESCODEEXT.DuplicateAppOfCICReportADay.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        } else if (0 <= _.indexOf([responCode.ScrappingResponseCodeCicReportINQError.CicReportINQError108.code], utilFunction.getStatusScrappingCode(body.data.outJson.outB0002.errMsg, body.data.outJson.errMsg))) {
                            cicService.updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, responCode.ScrapingStatusCode.CicReportInqError.code, responCode.RESCODEEXT.CICReportInqFailure.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.CicReportInqError.code + responCode.RESCODEEXT.CICReportInqFailure.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        }
                        else {
                            cicService.updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, responCode.ScrapingStatusCode.OtherError.code, responCode.RESCODEEXT.ETCError.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.OtherError.code + '-' + responCode.RESCODEEXT.ETCError.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        }
                    } else {
                        // cicService.updateScrpModCdHasNoResponseFromScraping(req.body.niceSessionKey, res).then(() => {
                        //     console.log("update SCRP_MOD_CD = 00 ");
                        //     return next();
                        // });
                        cicService.updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, responCode.ScrapingStatusCode.OtherError.code, responCode.RESCODEEXT.ETCError.code).then(rslt => {
                            if (1 <= rslt)
                                console.log('Update scraping status:' + responCode.ScrapingStatusCode.OtherError.code + '-' + responCode.RESCODEEXT.ETCError.code);
                            else
                                console.log('Update scraping status failure!');
                        });
                    }

                }

                return res.status(200).json(body.data);

            }).catch((error) => {
                console.log("error scraping service B0002~~", error);
                //Update ScrpModCd 00
                cicService.updateScrpModCdTryCntHasNoResponseFromScraping(req.body.niceSessionKey, res).then(() => {
                    console.log("update SCRP_MOD_CD = 00 ");
                    return next();
                });
            });

    } catch (err) {
        console.log("error cicInternalJson", err);
        return res.status(500).json({ error: err.toString() });
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
const LoanAttention12MInfor = require('../domain/loanAttention12mInfo');
const creditContractInfor = require('../domain/creditContractInfo.save');
const customerLookupInfo = require('../domain/customerLookUpInfo.save');
const colletaralLoanSecuInfo = require('../domain/collateralLoanSecuInfo.save');
const card3yearInfo = require('../domain/card3YearInfo.save');

const excuteInsert = require('../services/excuteInsert.service');

const getLoanDetail = require('../util/defineitem/defineLoan');
const defineColletral = require('../util/defineitem/defineCollateral');
const defineCard3Year = require('../util/defineitem/defineCard3Y');
const utilFunction = require('../../shared/util/util');
const CICB1003Save = require('../../ExternalAPI/domain/cicB1003.save');
const cicS37Service = require('../../ExternalAPI/services/cicInternalS37.service');
const cicDelayReportService = require('../services/cicDelayReport.service');

const calBetweenDate = require('../util/calBetweenDate');
const dataCreditScoreInfo = require('../domain/creditScoreInfo.save');

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
        logger.debug('Log request parameters send from internal B0003');
        logger.info(req.body);

        axios.post(URI.cicInternalJson, req.body, config)
            .then((body) => {

                // const niceSessionKey = req.body.niceSessionKey;
                const sysDtim = dateutil.timeStamp();
                const workID = getIdGetway.getIPGateWay();

                console.log("outJson.outB0003~~~~~", body.data.outJson.outB0003);
                //Logging response
                logger.debug('Log response parameters from scrapping service B0003');
                logger.info(body.data);

                // get nice session key to update scrapping fail status
                let niceSessionKeyUpdateStatus = req.body.niceSessionKey;

                if (body.data && body.data.outJson && body.data.outJson.errMsg && _.isEqual('input captcha image', body.data.outJson.errMsg.toLowerCase())) {
                    let dataStep = body.data.outJson.step_data;
                    let imgBase64 = body.data.outJson.step_img;

                    return res.status(200).json({ imgBase64, dataStep });
                }

                // update process status = 10 update process completed
                else if (body.data && body.data.outJson && !_.isEmpty(body.data.outJson.outB0003) && body.data.outJson.outB0003.errYn  && body.data.outJson.outB0003.errYn == "N") {
                    //update process status = 10, sucecssful recieve response from scraping service

                    if (_.isEmpty(body.data.outJson.outB0003.list)) {
                        //Update ScrpModCd 00
                        cicService.updateCICReportInquiryReadyToRequestScraping(req.body.niceSessionKey).then(() => {
                            console.log(" B0003 rowCount = 0 update SCRP_MOD_CD = 00 ");
                            return next();
                        });
                    } else {
                        // Get customer
                        body.data.outJson.outB0003.list.forEach(list => {
                            let rpCicId = list.cicNo;
                            console.log('rpCicId:', rpCicId);
                            let listDataCicidAndNiceSessionkey = _.find(req.body.dataCic, ['CICID', rpCicId]);
                            if (!_.isEmpty(listDataCicidAndNiceSessionkey)) {
                                console.log('niceSessionKey:', listDataCicidAndNiceSessionkey.NICESESSIONKEY);
                                let niceSessionKey = listDataCicidAndNiceSessionkey.NICESESSIONKEY;
                                let sysDtimDelay = listDataCicidAndNiceSessionkey.SYS_DTIM;

                                if (!_.isEmpty(list.reportS11A)) {
                                    // 3.CICRPT main
                                    const listcicRptInfo = list.reportS11A.cicRptInfo;
                                    const listcusInfor = list.reportS11A.customerInfo;

                                    // msg
                                    const reportS11AMSG = list.reportS11A;
                                    const msg = getMSG.getMSG(reportS11AMSG);

                                    // Customer comment
                                    const cuscomt = '';

                                    const objciccptmain = new ciccptmain(listcicRptInfo, listcusInfor, msg, niceSessionKey, listcusInfor.address, cuscomt);
                                    console.log('objciccptmain:', objciccptmain);

                                    // end get customer

                                    /* 
                                      ** Excute insert
                                    */
                                    // creditScoreInfo
                                    let creditScoreInfo = list.reportS11A.creditScoreInfo;
                                    let objectCreditScoreInfo = {};
                                    if (!_.isEmpty(creditScoreInfo)) {
                                        objectCreditScoreInfo = new dataCreditScoreInfo(niceSessionKey, creditScoreInfo, 'S11A');
                                    }
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
                                            let _listName = '';
                                            let _listDate = '';
                                            let count = 0;
                                            _.forEach(res.companyList, (resCompany, key) => {
                                                count++;
                                                _listName = _listName + resCompany.name + "\n";
                                                _listDate = _listDate + resCompany.date + "\n";
                                            });
                                            let listName = _listName.substring(0, _listName.length - 1);
                                            let listDate = _listDate.substring(0, _listDate.length - 1);
                                            const preVal2 = new LoanAttention12MInfor(res, niceSessionKey, sysDtim, workID, seqAttLoan, listName, listDate);
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

                                    excuteInsert.insertScrapingMSG(bindsLoanDetailInfor, bindlistloan5YearInfo, bindlistloan12monInfo, objciccptmain, objCreditcardinfor, bindlistVamcLoanInfo, bindlistloanAtt12monInfo, bindlistCreditContractInfo, bindlistcusLookupInfo, objCollateralInfo, objCard3YearInfo, objectCreditScoreInfo).then(resultMSG => {
                                        console.log('insert Scraping MSG:', resultMSG);
                                        if (!_.isEmpty(resultMSG)) {
                                            // update complete cic report inquiry status 10
                                            cicService.updateCICReportInquiryCompleted(niceSessionKey, '').then(resultUpdated => {
                                                console.log("CIC report inquiry completed!", resultUpdated);

                                            });

                                            /*
                                            **   update translog 
                                            */
                                            // encrypt password
                                            let password = convertPassword.convertTextToBase64(req.body.userPw);
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
                                // Update delay report = 02, 03
                                else if (_.isEqual('Wait'.toUpperCase().trim(), list.status.toUpperCase().trim())) {
                                    // Update delay report = 03
                                    if (_.isEqual('Wait'.toUpperCase().trim(), list.status.toUpperCase().trim()) && 30 < calBetweenDate.getMinute(sysDtimDelay, req.body.sendTime)) {
                                        cicDelayReportService.updateScrpModCd03(niceSessionKey).then(resUpdatedDelay03 => {
                                            if (1 <= resUpdatedDelay03) {
                                                console.log('Update sucessfully delay report = 03!');
                                            }
                                        });
                                    } else {
                                        cicDelayReportService.updateDelayReportS11A(niceSessionKey).then(resUpdatedDelay02 => {
                                            if (1 <= resUpdatedDelay02) {
                                                console.log('Update sucessfully delay report = 02!');
                                            }
                                        });
                                    }
                                }

                                // Update  SCRP_MOD_CD = 0 continute request to scrapping service
                                else {
                                    cicService.updateScrpModCdHasNoResponseFromScraping(niceSessionKey).then(() => {
                                        console.log("B0003 update SCRP_MOD_CD = 00 ");
                                        return next();
                                    });
                                }
                            }
                            // // Update  SCRP_MOD_CD = 0 continute request to scrapping service
                            // else {
                            //     cicService.updateCICReportInquiryReadyToRequestScraping(niceSessionKeyUpdateStatus).then(() => {
                            //         console.log(" B0003 uppdate case output B0003 empty ");
                            //         return next();
                            //     });
                            // }
                        });
                    }

                }

                // start B10003
                else if (body.data && body.data.outJson && !_.isEmpty(body.data.outJson.outB1003) && body.data.outJson.outB1003.errYn == "N" && _.isEmpty(body.data.outJson.outB1003.errMsg)) {
                    let dataB1003 = body.data.outJson.outB1003;
                    // convert nice session key for B1003 process
                    let niceKey = req.body.niceSessionKey[0];

                    let CICB1003 = new CICB1003Save(dataB1003, niceKey);
                    cicS37Service.insertS37Detail(CICB1003).then(resultS37 => {
                        console.log('resultS37:', resultS37);
                        if (1 < resultS37) {
                            console.log('Successfully insert into S37 detail table');
                            // update complete cic report inquiry status 10
                            cicService.updateCICReportInquiryCompleted(niceKey, '').then(resultUpdated => {
                                console.log("CIC report inquiry completed B1003!", resultUpdated);

                            });

                            /*
                            **   update translog 
                            */
                            // encrypt password
                            let password = convertPassword.convertTextToBase64(req.body.userPw);
                            let requestParams = req.body;
                            let responseParams = { cicNo: body.data.outJson.outB1003.cicNo };
                            let scrplogid = 'S37' + dateutil.timeStamp();
                            let workId = getIdGetway.getIPGateWay();

                            let dataTransSave = new cicTransSave(requestParams, responseParams, scrplogid, workId, password, body.data.outJson.outB1003.cicNo, niceKey);
                            cicServiceRes.updateScrapingTranslog(dataTransSave).then(() => {
                                console.log("Updated to scraping transaction log B1003!");
                                return next();
                            });
                        } else {
                            cicService.updateScrpModCdHasNoResponseFromScraping(niceKey).then(() => {
                                console.log("B0003 update SCRP_MOD_CD = 00 ");
                                return next();
                            });
                        }
                    });

                }
                // End B1003

                else if (body.data && body.data.outJson && _.isEqual(body.data.outJson.outB0003.errMsg, 'rowCount = 0') && _.isEmpty(body.data.outJson.outB0003.list)) {
                    //Update ScrpModCd 00
                    cicService.updateCICReportInquiryReadyToRequestScraping(req.body.niceSessionKey).then(() => {
                        console.log(" B0003 rowCount = 0 update SCRP_MOD_CD = 00 ");
                        return next();
                    });
                } else {
                    // Log in error
                    if (utilFunction.checkStatusCodeScraping(responCode.ScrappingResponseCodeLoginFailure, body.data.outJson.errMsg)) {
                        if (0 <= _.indexOf([responCode.ScrappingResponseCodeLoginFailure.LoginFail1.code, responCode.ScrappingResponseCodeLoginFailure.LoginFail2.code, responCode.ScrappingResponseCodeLoginFailure.LoginFail6.code], utilFunction.getStatusScrappingCode(body.data.outJson.errMsg))) {
                            cicService.updateListScrpStatCdErrorResponseCodeScraping(niceSessionKeyUpdateStatus, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.CICSiteAccessFailure.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.LoginInError.code + '-' + responCode.RESCODEEXT.CICSiteAccessFailure.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        } else if (0 <= _.indexOf([responCode.ScrappingResponseCodeLoginFailure.LoginFail3.code, responCode.ScrappingResponseCodeLoginFailure.LoginFail4.code, responCode.ScrappingResponseCodeLoginFailure.LoginFail5.code], utilFunction.getStatusScrappingCode(body.data.outJson.errMsg))) {
                            cicService.updateListScrpStatCdErrorResponseCodeScraping(niceSessionKeyUpdateStatus, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.CICSiteLoginFailure.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.LoginInError.code + '-' + responCode.RESCODEEXT.CICSiteLoginFailure.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        } else if (0 <= _.indexOf([responCode.ScrappingResponseCodeLoginFailure.LoginFail7.code], utilFunction.getStatusScrappingCode(body.data.outJson.errMsg))) {
                            cicService.updateListScrpStatCdErrorResponseCodeScraping(niceSessionKeyUpdateStatus, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.S37ReportScreenAccsError.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.LoginInError.code + '-' + responCode.RESCODEEXT.S37ReportScreenAccsError.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        } else {
                            cicService.updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.ETCError.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.LoginInError.code + '-' + responCode.RESCODEEXT.ETCError.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        }

                    }
                    // CIC report result inquiry error S11
                    else if (utilFunction.checkStatusCodeScraping(responCode.ScrappingResponseCodeCicReportResultINQError, body.data.outJson.outB0003.errMsg) || utilFunction.checkStatusCodeScraping(responCode.ScrappingResponseCodeCicReportResultINQError, body.data.outJson.errMsg)) {
                        if (0 <= _.indexOf([responCode.ScrappingResponseCodeCicReportResultINQError.CicReportResultINQError1.code, responCode.ScrappingResponseCodeCicReportResultINQError.CicReportResultINQError2.code], utilFunction.getStatusScrappingCode(body.data.outJson.outB0003.errMsg, body.data.outJson.errMsg))) {
                            cicService.updateListScrpStatCdErrorResponseCodeScraping(niceSessionKeyUpdateStatus, responCode.ScrapingStatusCode.CicReportResultInqError.code, responCode.RESCODEEXT.CICReportInqFailure.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status B0003:' + responCode.ScrapingStatusCode.CicReportResultInqError.code + '-' + responCode.RESCODEEXT.CICReportInqFailure.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        }
                    }
                    // CIC report result inquiry error S37
                    else if (utilFunction.checkStatusCodeScraping(responCode.ScrappingResponseCodeCicReportResultINQS37Error, body.data.outJson.outB1003.errMsg) || utilFunction.checkStatusCodeScraping(responCode.ScrappingResponseCodeCicReportResultINQS37Error, body.data.outJson.errMsg)) {
                        if (0 <= _.indexOf([responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError1.code, responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError2.code
                            , responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError102.code, responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError103.code
                            , responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError104.code, responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError105.code
                            , responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError106.code, responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError107.code], utilFunction.getStatusScrappingCode(body.data.outJson.outB1003.errMsg, body.data.outJson.errMsg))) {
                            cicService.updateListScrpStatCdErrorResponseCodeScraping(niceSessionKeyUpdateStatus, responCode.ScrapingStatusCode.CicReportInqError.code, responCode.RESCODEEXT.S37ReportScreenAccsError.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status B1003:' + responCode.ScrapingStatusCode.CicReportInqError.code + '-' + responCode.RESCODEEXT.S37ReportScreenAccsError.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        } else if (0 <= _.indexOf([responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError3.code, responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError201.code], utilFunction.getStatusScrappingCode(body.data.outJson.outB1003.errMsg, body.data.outJson.errMsg))) {
                            cicService.updateListScrpStatCdErrorResponseCodeScraping(niceSessionKeyUpdateStatus, responCode.ScrapingStatusCode.CicIdInqError.code, responCode.RESCODEEXT.NoMatchingCICIDWithNalID.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status B1003:' + responCode.ScrapingStatusCode.CicIdInqError.code + '-' + responCode.RESCODEEXT.NoMatchingCICIDWithNalID.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        }
                        else if (0 <= _.indexOf([responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError101.code], utilFunction.getStatusScrappingCode(body.data.outJson.outB1003.errMsg, body.data.outJson.errMsg))) {
                            cicService.updateListScrpStatCdErrorResponseCodeScraping(niceSessionKeyUpdateStatus, responCode.ScrapingStatusCode.CicIdInqError.code, responCode.RESCODEEXT.NotUniquePersonInCIC.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status B1003:' + responCode.ScrapingStatusCode.CicIdInqError.code + '-' + responCode.RESCODEEXT.NotUniquePersonInCIC.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        }
                        else if (0 <= _.indexOf([responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError108.code], utilFunction.getStatusScrappingCode(body.data.outJson.outB1003.errMsg, body.data.outJson.errMsg))) {
                            cicService.updateListScrpStatCdErrorResponseCodeScraping(niceSessionKeyUpdateStatus, responCode.ScrapingStatusCode.CicReportInqError.code, responCode.RESCODEEXT.CaptchaProcessFailure.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status B1003:' + responCode.ScrapingStatusCode.CicReportInqError.code + '-' + responCode.RESCODEEXT.CaptchaProcessFailure.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        }
                    }
                    else {
                        // cicService.updateCICReportInquiryReadyToRequestScraping(req.body.niceSessionKey, res).then(() => {
                        //     console.log(" B0003 update SCRP_MOD_CD = 00 ");
                        //     return next();
                        // });
                        cicService.updateListScrpStatCdErrorResponseCodeScraping(niceSessionKeyUpdateStatus, responCode.ScrapingStatusCode.OtherError.code, responCode.RESCODEEXT.ETCError.code).then(rslt => {
                            if (1 <= rslt)
                                console.log('Update scraping status:' + responCode.ScrapingStatusCode.OtherError.code + '-' + responCode.RESCODEEXT.ETCError.code);
                            else
                                console.log('Update scraping status failure!');
                        });

                    }
                }

                return res.status(200).json(body.data);

            }).catch((error) => {
                logger.error("error scraping service B0003~~", error.toString());
                //Update ScrpModCd 00
                cicService.updateCICReportInquiryReadyToRequestScraping(req.body.niceSessionKey).then(() => {
                    console.log(" B0003 update SCRP_MOD_CD = 00 ");
                    return next();
                });
            });

    } catch (err) {
        logger.error("error internal_CICB0003", err.toString());
        return res.status(500).json({ error: err.toString() });
    }
};
