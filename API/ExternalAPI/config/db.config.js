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
    poolIncrement: 0,
    poolTimeout: 0
}
let poolInfo;


async function startInit() {
    try {
        await oracledb.createPool(
            dbOption,
            function (err, pool) {
                if (err) {
                    console.error("DB Config initialize createPool() error: " + err.message);
                    //throw err;
                }
                poolInfo = pool;
            }
        );//end oracledb.createpool

    } catch (e) {
        console.log("DB Config initialize catch:");
        if (poolInfo) {
            await poolInfo.close();
        }
        //await initialize();
        console.log(e.toString());
    } finally {

    }
}

async function initialize() {
    //create oracle connection pool
    try {
        let checkPool = oracledb.getPool(config.poolAlias);
        console.log("DB Config initialize check Pool:");
        console.log(checkPool);
        if(!checkPool){
            startInit()
        }else{
            console.log("DB Config initialize check Pool already exists:");
            checkPool._logStats();
        }
    } catch (e) {
        console.log("DB Config initialize catch:");
        if (poolInfo) {
            await poolInfo.close();
        }
        //await initialize();
        console.log(e.toString());
    } finally {

    }
}

function poolInfoFnc() {
    console.log(poolInfo._logStats());
}

module.exports.startInit = startInit;
module.exports.initialize = initialize;
module.exports.poolInfoFnc = poolInfoFnc;