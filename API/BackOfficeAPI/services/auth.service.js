const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');

const bcrypt = require('bcrypt');
const saltRounds = 12;
var salt = bcrypt.genSaltSync(saltRounds);
const config = require('../config/config')

async function getUser(req) {
    let connection;
    try {
        let sql, result;

        var user_pwd = req.body.password;

        connection = await oracledb.getConnection(dbconfig);

        sql = `SELECT ACTIVE, ROLE_ID, USER_PW , USER_ID, USER_NM, CUST_CD, INOUT_GB, ADDR,
         EMAIL,TEL_NO_MOBILE, SYS_DTIM,
         to_char(to_date(VALID_START_DT, 'yyyymmdd'),'yyyy/mm/dd') AS VALID_START_DT,to_char(to_date(VALID_END_DT, 'yyyymmdd'),'yyyy/mm/dd') AS VALID_END_DT, 
         to_char(to_date(SYS_DTIM, 'YYYY/MM/DD HH24:MI:SS'),'yyyy/mm/dd hh24:mi:ss') AS SYS_DTIM ,
          WORK_ID FROM TB_ITUSER
                where USER_NM = :user_name `;

        result = await connection.execute(sql, {user_name: { val: req.body.username }}, {outFormat: oracledb.OUT_FORMAT_OBJECT});
            console.log(bcrypt.hashSync(user_pwd, salt));
            
        if (bcrypt.compareSync(user_pwd, result.rows[0].USER_PW)) {
            console.log("OK password");
            return result.rows;
        } else {
            return;
        }
        // return res.status(200).json(result.rows);
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

module.exports.getUser = getUser;
