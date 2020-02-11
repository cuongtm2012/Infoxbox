const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');

/*
** select FI code(CUST_CD)
*/
async function selectFiCode(fiCode) {
    let connection;

    try {
        //Connection db
        connection = await oracledb.getConnection(dbconfig);

        let sqlCusLookup = `select T.CUST_CD, T.GDS_CD from TB_ITCTRT T where T.CUST_CD =:CUST_CD`;

        let result = await connection.execute(
            // The statement to execute
            sqlCusLookup,
            {
                CUST_CD: { val: fiCode }
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            });
        console.log("selectFiCode rows:", result.rows);

        return result.rows;
    } catch (err) {
        console.log(err);
        // return res.status(400);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.log(error);
            }
        }
    }
}

module.exports.selectFiCode = selectFiCode;