
const Cics11aModelReq = require('../domain/customer.request');

const logger = require('../shared/logs/logger');

const customerService = require('../services/customer.service');

exports.runInsert = async function (req, res, next) {
    customerService.runInsert(req, res).then(resultFinal => {
        // console.log("resultFinalInsert:::", resultFinal)
        logger.debug('Log Insert from routes after manage request')
        // logger.debug(resultFinal)
        return res.status(200).json(resultFinal.rowsAffected);
    });
}
