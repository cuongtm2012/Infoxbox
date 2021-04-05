const poolInfo = require('../config/db.config');
exports.pingPong = function (req, res) {
    poolInfo.poolInfoFnc();
    let dateNow = new Date();
    const body = {
        status: "success",
        message: "pong",
        date: dateNow.toISOString()
    }
    res.status(200).send(body);
}