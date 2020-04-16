var request = require('request');
var logger = require('../config/logger');
const config = require("../config/config");
const urlGetAuth = config.URL_REQUEST_LIVE + '/oauth2/token';
const urlGetBrand = config.URL_REQUEST_LIVE + '/api/push-brandname-otp';
let count = 0;

exports.getAuth = function () {
    return new Promise(function (resolve, reject) {
        request.post(
            urlGetAuth,
            {
                json: {
                    grant_type: config.jsonURL.grant_type,
                    client_id: config.jsonURL.envi.live.client_id,
                    client_secret: config.jsonURL.envi.live.client_secret,
                    scope: config.jsonURL.scope,
                    session_id: config.jsonURL.session_id
                }
            },
            function (error, response, body) {
                if (error) throw error;
                if (!error && response.statusCode === 200) {
                    console.log(body);
                    resolve(body);
                } else {
                    console.log(response.statusCode);
                    console.log(response.statusMessage);
                    console.log(body);
                    console.log(count);
                    logger.error(body);
                    reject('fail to get authority for sending otp sms');
                }
            }
        );
    })
};

exports.sendBrandNameOTP = async function (OTP_input) {
    return new Promise(function (resolve, reject) {
        request.post(
            urlGetBrand,
            {
                json: {
                    access_token: OTP_input.access_token,
                    session_id: OTP_input.session_id,
                    BrandName: OTP_input.BrandName,
                    Phone: OTP_input.Phone,
                    Message: OTP_input.Message,
                }
            },
            function (error, response, body) {
                        if (error) throw error;
                        if (!error && response.statusCode === 200) {
                            console.log(body);
                            console.log("============================= count =============================");
                            count++;
                            console.log(count);
                            console.log('success to send otp');
                            resolve(true);
                        } else {
                            console.log('fail to send otp');
                            console.log(response.statusCode);
                            console.log(response.statusMessage);
                            console.log(body);
                            logger.error(body);
                            resolve(false);
                }
            }
        )
    })

};
