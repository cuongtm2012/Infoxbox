const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');

const dateUtil = require('../util/dateutil');
const _ = require('lodash');

async function insertManulCaptcha(req, niceSessionKey, imgBase64) {
    let connection;
    let sysDtim = dateUtil.timeStamp();

    try {
        let sql, result;

        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_MANUAL_CAPTCHA(NICE_SSIN_ID,
            CAP_IMG,
            ST_DT_STEP,
            ST_DT_CICORGVN,
            ST_DT_LB_COOKIES,
            ST_DT_VIEW_STATE,
            ST_DT_REF,
            ST_DT_STAE,
            ST_DT_AFRLOOP,
            SYS_DTIM) VALUES (:NICE_SSIN_ID,
                    :CAP_IMG,
                    :ST_DT_STEP,
                    :ST_DT_CICORGVN,
                    :ST_DT_LB_COOKIES,
                    :ST_DT_VIEW_STATE,
                    :ST_DT_REF,
                    :ST_DT_STAE,
                    :ST_DT_AFRLOOP,
                    :SYS_DTIM)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: { val: niceSessionKey },
                CAP_IMG: { val: imgBase64 },
                ST_DT_STEP: { val: req.step },
                ST_DT_CICORGVN: { val: req.cookie.CICORGVN },
                ST_DT_LB_COOKIES: { val: req.cookie.LB_cookies },
                ST_DT_VIEW_STATE: { val: req.ViewState },
                ST_DT_REF: { val: req.ref },
                ST_DT_STAE: { val: req.state },
                ST_DT_AFRLOOP: { val: req.afrLoop },
                SYS_DTIM: { val: sysDtim }
            },
            { autoCommit: true }
        );

        console.log("insertManulCaptcha updated::", result.rowsAffected);

        return result.rowsAffected;
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

module.exports.insertManulCaptcha = insertManulCaptcha;
