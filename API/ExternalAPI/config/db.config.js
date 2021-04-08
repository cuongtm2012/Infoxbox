const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');
const config = require('./config')
const SQL = `SELECT COUNT (*) AS COUNT FROM tb_inqlog WHERE sys_dtim BETWEEN ('20210405000000') AND ('20210407000000')`;
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

                setInterval(async function () {
                    pool.getConnection(async function (e, c) {
                        if (err) {
                            throw err
                        }
                        let result = await c.execute(
                            // The statement to execute
                            SQL,
                            {},
                            {
                                outFormat: oracledb.OUT_FORMAT_OBJECT
                            });
                        c.release();
                    });
                }, 30000);
                poolInfo = pool;
            }
        );//end oracledb.createpool
    } catch (e) {
        if (poolInfo) {
            await poolInfo.close();
        }
        await initialize();
        console.log(e.toString());
    }
}

function poolInfoFnc() {
    console.log(poolInfo._logStats());
}

module.exports.initialize = initialize;
module.exports.poolInfoFnc = poolInfoFnc;