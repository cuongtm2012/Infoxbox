
let oracledb = require('oracledb');
const config = require('../config/config');

module.exports.start = function () {
    setInterval(() => {
        cronFunction().catch();
    }, 60 * 60 * 1000);
}

async function cronFunction() {
    let connection;
    try {
        connection = await oracledb.getConnection(config.poolAlias);
        let sql = "select 1 from dual";
        let result = await connection.execute(sql);
        console.log("connection!", result);
    } catch (err) {
        console.log(err);
    } finally {
        console.log("finally1");
        if (connection) {
            console.log("finally2");
            try {
                console.log("finally3");
                await connection.close();
            } catch (error) {
                console.log(error);
            }
        }
    }
}