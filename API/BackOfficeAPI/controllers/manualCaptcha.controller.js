const axios = require('axios');
const query = require('../services/oracelQuery.service');
const optionCommit = {autoCommit: true};
const serviceURL = require('../url/manualCaptcha');
const logger = require('../config/logger');

exports.serviceStart = async function(req, res, next) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
        }

        console.log(" req.body:::", req.body);
        //Logging request
        logger.debug('Log request parameters send from internal');
        logger.info(req.body);

        const body = await axios.post(serviceURL.start, req.body, config)
        return res.status(200).send(body);
    } catch(err) {
        console.log(err);
        logger.debug('cannot post')
        return res.status(500).send(err);
    }
}

exports.serviceCall = async function(req, res, next) {
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

        const body = axios.post(serviceURL.call, req.body, config)
        return res.status(200).send(body);
    } catch(err) {
        console.log(err);
        logger.debug('cannot post')
        return res.status(500).send(err);
    }
}

exports.serviceCall2 = async function(req, res, next) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
        }

        console.log(" req.body:::", req.body);
        //Logging request
        logger.debug('Log request parameters send from internal');
        logger.info(req.body);

        const body = await axios.post(serviceURL.call, req.body, config)
        await saveManualCaptcha(res, body);
    } catch(err) {
        console.log(err);
        logger.debug('cannot post')
        return res.status(500).send(err);
    }
}

let saveManualCaptcha = async function(res, body) {
    let INSERT = 'INSERT INTO TABLE MANUAL_CAPTCHA( NICE_SSIN_ID, CAP_IMG, ST_DT_STEP, ST_DT_CICORGVN, ST_DT_LB_COOKIES, ST_DT_VIEW_STATE, ST_DT_REF, ST_DT_STAE, ST_DT_AFRLOOP)';
    let VALUE = ' VALUES ( NICE_SSIN)_ID, :CAP_IMG, :ST_DT_STEP, :ST_DT_CICORGVN, :ST_DT_LB_COOKIES, :ST_DT_VIEW_STATE, :ST_DT_REF, :ST_DT_STAE, :ST_DT_AFRLOOP)';
    let values = [body.niceSessionId, body.capImg, body.step, body.cicorgvn, body.cookies, body.viewState, body.ref, body.stae, body.afrloop];
    let sql = INSERT + VALUE;
    return await query.queryOracel(res, sql, values, optionCommit);
}