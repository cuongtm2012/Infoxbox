const validRequest = require('../util/validateZaloScoreRequest');
const _ = require('lodash');
const dateutil = require('../util/dateutil');
const PreResponse = require('../domain/preResponse.response');
exports.zaloScore = function (req, res) {
    try {
        //checking parameter
        let rsCheck = validRequest.checkParamRequest(req.body);
        let preResponse, responseData, dataInqLogSave;
        console.log(rsCheck);

        if (!_.isEmpty(rsCheck)) {
            preResponse = new PreResponse(rsCheck.responseMessage, '', dateutil.timeStamp(), rsCheck.responseCode);
        }
    } catch (err) {
        return res.status(500).json({error: err.toString()});
    }
}
