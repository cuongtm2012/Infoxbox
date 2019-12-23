const axios = require('axios');
const URI = require('../../shared/URI');
const cicService = require('../services/cicInternal.service');
const validation = require('../../shared/util/validation');

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

                // update process status = 9 update process completed
                if (!validation.isEmptyJson(body.data.outJson.outB0001) && body.data.outJson.outB0001.errYn == "N") {
                    //update process status = 9, sucecssful send request to cic server
                    cicService.updateCICReportInquirySuccessful(req.body, res).then(resultUpdated => {
                        console.log("CIC report inquiry successful!");
                        //TODO Update response to table
                    });
                } else {
                    return next(body);

                }

                return res.status(200).json(body.data);

            }).catch((error) => {
                console.log(error)
            });

    } catch (err) {
        return next(err)
    }
};