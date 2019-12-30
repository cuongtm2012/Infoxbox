const axios = require('axios');
const URI = require('../../shared/URI');
const cicService = require('../services/cicInternal.service');
const cicServiceRes = require('../services/cicInternalRes.service');
const validation = require('../../shared/util/validation');
const cicTransSave = require('../domain/cicTrans.save');
const encryptPassword = require('../util/encryptPassword');
const getIdGetway = require('../../shared/util/getIPGateWay');

// Validate parameters
// exports.validate = (method) => {
//     switch (method) {
//         case 'cicB0001': {
//             return [
//                 body('appCd', 'appCd does not exists').exists(),
//                 body('orgCd', 'orgCd does not exists').exists(),
//                 body('svcCd', 'svcCd does not exists').exists(),
//                 body('userId', 'userId does not exists').exists(),
//                 body('userPw', 'userPw does not exists').exists()
//             ]
//         }
//     }
// };

exports.internalCIC = function (req, res, next) {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     res.status(422).json({ errors: errors.array() });
        //     return;
        // }

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
            // timeout: 6000
        }
        console.log(" req.body:::", req.body);

        // var querystrings = qs.stringify(req.body).substring(0, qs.stringify(req.body).length - 1);
        // var querystrings = converJsonURL.convertJsonURL(req.body);
        // console.log(" querystrings:::", querystrings);

        // "?inJsonList=%5B" + querystrings + "%5D"
        // URI.cicB0001 + querystrings
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