const oracledb = require('oracledb');
const config = require('../config/config');
const dateUtil = require('../util/dateutil');
const database = require('../config/db.config');
/*
** select FI code(CUST_CD)
*/
async function selectFiCode(fiCode, goodCode) {
    let connection;

    try {
        //Connection db
        database.initialize().then();
        connection = await oracledb.getConnection(config.poolAlias)
        let currentDate = dateUtil.getCurrentInquiryDate();

        let sqlCusLookup = `select T.CUST_CD, T.GDS_CD from TB_ITCTRT T 
                            where T.CUST_CD =:CUST_CD
                            and T.gds_cd like :gds_cd
                            and T.valid_start_dt <= :currentDate
                            and T.valid_end_dt > :currentDate
                            and T.STATUS = 1`;

        let result = await connection.execute(
            // The statement to execute
            sqlCusLookup,
            {
                CUST_CD: { val: fiCode },
                gds_cd: { val: goodCode },
                currentDate: { val: currentDate }
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            });
        console.log("selectFiCode rows:", result.rows);

        return result.rows;
    } catch (err) {
        console.log('err:', err);
        return err;
    } finally {
        if (connection) {
            try {
                console.log("selectFiCode: connection.close 1");
                console.log(database.poolInfoFnc());
                await connection.close();
                console.log("selectFiCode: connection.close 2");
                console.log(database.poolInfoFnc());
            } catch (error) {
                console.log("selectFiCode: connection.close error");
                console.log(error);
            }
        }
    }
}

module.exports.selectFiCode = selectFiCode;