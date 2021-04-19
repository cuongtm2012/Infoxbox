const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');
const config = require('./config')
const dbOption = {
    _enableStats: true,
    user: dbconfig.user,
    password: dbconfig.password,
    connectString: dbconfig.connectString,
    poolAlias: config.poolAlias,
    poolMax: 10,
    poolMin: 10,
    poolIncrement: 0
}
let poolInfo;

async function initialize() {
    //create oracle connection pool
    try {
        await oracledb.createPool(
            dbOption,
            function (err, pool) {
                if (err) {
                    console.error("createPool() error: " + err.message);
                    throw err;
                }
                poolInfo = pool;
            }
        );//end oracledb.createpool
    } catch (e) {
        console.log(e.toString());
        throw e;
    }
}

function poolInfoFnc() {
    console.log(poolInfo._logStats());
}

module.exports.initialize = initialize;
module.exports.poolInfoFnc = poolInfoFnc;