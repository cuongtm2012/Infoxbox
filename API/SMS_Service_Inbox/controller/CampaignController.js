let request = require('request');
require('dotenv').config();
const urlGetAuth = process.env.URL_REQUEST + '/oauth2/token';
const urlCreateCampaign = process.env.URL_REQUEST + '/api/create-campaign';
const urlSendCampaign = process.env.URL_REQUEST + '/api/push-brandname-ads';
const logger = require('../config/logger');
let count = 0;

exports.getAuth = function () {
    return new Promise(function (resolve, reject) {
        request.post(
            urlGetAuth,
            {
                json: {
                    grant_type: 'client_credentials',
                    client_id: '124377fd94eff2C59988eE836d452eC23227252c',
                    client_secret: 'fdBaba82bc08F9c080364bb563c5f1dfd098533eAf415625d83b19ad72CC0dC5D34c5bb2',
                    scope: 'send_brandname',
                    session_id: '789dC48b88e54f58ece5939f14a'
                }
            },
            function (error, response, body) {
                if (error) throw error;
                if (!error && response.statusCode === 200) {
                    console.log(body);
                    logger.info(body);
                    resolve(body);
                } else {
                    console.log(response.statusCode);
                    console.log(response.statusMessage);
                    console.log(body);
                    logger.error(body);
                    reject('fail to get authority for sending campaign');
                }
            }
        );
    });
};

exports.createCampaign = function (campaign_input, access_token) {
    return new Promise(function (resolve, reject) {
        request.post(
            urlCreateCampaign,
            {
                json: {
                    access_token: access_token,
                    session_id: campaign_input.session_id,
                    CampaignName: campaign_input.CampaignName,
                    BrandName: campaign_input.BrandName,
                    Message: campaign_input.Message,
                    ScheduleTime: campaign_input.ScheduleTime,
                    Quota: campaign_input.Quota
                }
            },
            function (error, response, body) {
                if (error) throw error;
                if (!error && response.statusCode === 200) {
                    console.log(body);
                    logger.info(body);
                    resolve(body);
                } else {
                    console.log(response.statusCode);
                    console.log(response.statusMessage);
                    console.log(body);
                    logger.error(body);
                    reject('fail create campaign')
                }
            }
        )
    });
};

exports.sendSMS = function (ads_input) {
    return new Promise(function (resolve, reject) {
        console.log('===========phone==================');
        console.log(ads_input.PhoneList);
        request.post(
            urlSendCampaign,
            {
                json: {
                    access_token: ads_input.access_token,
                    session_id: ads_input.session_id,
                    CampaignCode: ads_input.CampaignCode,
                    PhoneList: ads_input.PhoneList,
                }
            },
            function (error, response, body) {
                if (error) throw error;
                if (!error && response.statusCode === 200) {
                    console.log(body);
                    console.log('========================================');
                    count ++;
                    console.log(count);
                    resolve(true);
                } else {
                    console.log(response.statusCode);
                    console.log(response.statusMessage);
                    console.log(body);
                    logger.error(body);
                    resolve(false);
                }
            }
        )
    });

};



