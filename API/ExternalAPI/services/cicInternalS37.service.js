import oracledb from 'oracledb';
import config from '../config/config.js';
import dateutil from '../util/dateutil.js';
import getIdGetway from '../../shared/util/getIPGateWay.js';

async function insertS37Detail(req) {
    let connection;

    try {
        let sql, sqlInsertCICRPTMain, result, resultCicrptMain;
        let sysDtim = dateutil.timeStamp();
        const workID = getIdGetway.getIPGateWay();

        connection = await oracledb.getConnection(config.poolAlias);

        //TB CICCRPT MAIN
        sqlInsertCICRPTMain = `INSERT INTO TB_CICRPT_MAIN (NICE_SSIN_ID,
            PSN_NM,
            CIC_ID,
            PSN_ADDR,
            SYS_DTIM,
            WORK_ID)VALUES (:NICE_SSIN_ID,
                :PSN_NM,
                :CIC_ID,
                :PSN_ADDR,
                :SYS_DTIM,
                :WORK_ID)`;

        resultCicrptMain = await connection.execute(
            sqlInsertCICRPTMain,
            {
                NICE_SSIN_ID: { val: req.niceSessionKey },
                PSN_NM: { val: req.name },
                CIC_ID: { val: req.cicNo },
                PSN_ADDR: { val: req.address },
                SYS_DTIM: { val: sysDtim },
                WORK_ID: { val: workID }
            },
            { autoCommit: false }
        );
        console.log("insertS37Detail CICRPTMain updated::", resultCicrptMain.rowsAffected);

        // TB_S37-DETAIL
        sql = `INSERT INTO TB_S37_DETAIL( NICE_SSIN_ID,       
                RLTN_FI_CNT,      
                CTS_LOAN_YN,      
                BAD_LOAN_YN,      
                BASE_DATE,      
                EWS_GRD,      
                RPT_CMT,    
                SYS_DTIM,        
                WORK_ID) VALUES (
                    :NICE_SSIN_ID,       
                    :RLTN_FI_CNT,      
                    :CTS_LOAN_YN,      
                    :BAD_LOAN_YN,      
                    :BASE_DATE,      
                    :EWS_GRD,      
                    :RPT_CMT,    
                    :SYS_DTIM,        
                    :WORK_ID )`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: { val: req.niceSessionKey },
                RLTN_FI_CNT: { val: req.numberOfFi },
                CTS_LOAN_YN: { val: req.cautionsLoanYn },
                BAD_LOAN_YN: { val: req.badLoanYn },
                BASE_DATE: { val: req.baseDate },
                EWS_GRD: { val: req.warningGrage },
                RPT_CMT: { val: req.reportComment },
                SYS_DTIM: { val: sysDtim },
                WORK_ID: { val: workID }
            },
            { autoCommit: true }
        );

        console.log("insertS37Detail updated::", result.rowsAffected);

        return result.rowsAffected + resultCicrptMain.rowsAffected;

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

export default insertS37Detail;