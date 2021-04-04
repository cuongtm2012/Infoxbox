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

        connection = await oracledb.getConnection(config.poolAlias);

        sql = `SELECT TB_ITUSER.ACTIVE, TB_ITUSER.USER_PW , TB_ITUSER.USER_ID, TB_ITUSER.USER_NM, TB_ITUSER.CUST_CD, TB_ITUSER.INOUT_GB, TB_ITUSER.ADDR,
         TB_ITUSER.EMAIL, TB_ITUSER.TEL_NO_MOBILE,
         to_char(to_date(TB_ITUSER.VALID_START_DT, 'yyyymmdd'),'yyyy/mm/dd') AS VALID_START_DT,to_char(to_date(TB_ITUSER.VALID_END_DT, 'yyyymmdd'),'yyyy/mm/dd') AS VALID_END_DT, 
         to_char(to_date(TB_ITUSER.SYS_DTIM, 'YYYY/MM/DD HH24:MI:SS'),'yyyy/mm/dd hh24:mi:ss') AS SYS_DTIM ,
          TB_ITUSER.WORK_ID , TB_ROLE_USER.ROLE_ID FROM TB_ITUSER 
          INNER JOIN TB_ROLE_USER ON TB_ROLE_USER.USER_ID = TB_ITUSER.USER_ID
                where LOWER(TB_ITUSER.USER_ID) = LOWER(:userID) `;

        result = await connection.execute(sql, {userID: {val: req.body.userID}}, {outFormat: oracledb.OUT_FORMAT_OBJECT});
        console.log(bcrypt.hashSync(user_pwd, salt));
        console.log(result[0]);
            
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
