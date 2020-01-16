
const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');
var _ = require('lodash');
exports.getCustInfo = async function (req, res) {
    var custClassicfication = req.query.custClassicfication;
    var cusCd = req.query.cusCd;
    var custNm = req.query.custNm;
    var optionSelect = { outFormat: oracledb.OUT_FORMAT_OBJECT };
    SQL_SELECT = `SELECT TB_ITCUST.CUST_GB as CUST_CLASSSIC, TB_ITCUST.CUST_CD as CUST_CODE, TB_ITCUST.CUST_NM as CUST_NM, TB_ITCUST.BRANCH_NM as BRANCH_NM, TB_ITCUST.CO_RGST_NO as CO_RGST_NO, TB_ITCUST.VALID_START_DT as VALID_START_DT, TB_ITCUST.VALID_END_DT as VALID_END_DT `;
    SQL_FROM = 'FROM TB_ITCUST ';
    SQL_WHERE_SEARCH = 'WHERE CUST_GB LIKE :custClassicfication OR CUST_CD LIKE :cusCd OR CUST_NM LIKE :custNm';

    if (_.isEmpty(custClassicfication) && _.isEmpty(cusCd) && _.isEmpty(custNm)) {
        let sql = SQL_SELECT + SQL_FROM;
        let param = {};
        queryOracel(res, sql, param, optionSelect);
    } else {
        sql = SQL_SELECT + SQL_FROM + SQL_WHERE_SEARCH;
        let param = {
            custClassicfication: { val: custClassicfication },
            cusCd: { val: cusCd },
            custNm: { val: custNm }
        };
        queryOracel(res, sql, param, optionSelect);
    }

};

async function queryOracel(res, sql, param, option) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbconfig);
        result = await connection.execute(
            sql, param, option);
        res.status(200).send(result.rows);
    } catch (err) {
        console.log(err);
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

exports.addCust = async function (req, res) {
    var optionInsert = { autoCommit: true };
    var classFication = req.body.classFication;
    var custCD = req.body.custCD;
    var custNM = req.body.custNM;
    var custNMENG = req.body.custNMENG;
    var custBranchNM = req.body.custBranchNM;
    var custBranchNM_EN = req.body.custBranchNM_EN;
    var coRgstNo = req.body.coRgstNo;
    var industryCD = req.body.industryCD;
    var prtOrganizationClass = req.body.prtOrganizationClass;
    var prtOrganizationCD = req.body.prtOrganizationCD;
    var addr = req.body.addr;
    var validStartDT = req.body.validStartDT;
    var validEndDT = req.body.validEndDT;
    var operationDate = req.body.operationDate;
    var userID = req.body.userID;
    let param = {
        classFication: { val: classFication },
        custCD: { val: custCD },
        custNM: { val: custNM },
        custNMENG: { val: custNMENG },
        custBranchNM: { val: custBranchNM },
        custBranchNM_EN: { val: custBranchNM_EN },
        coRgstNo: { val: coRgstNo },
        industryCD: { val: industryCD },
        prtOrganizationClass: { val: prtOrganizationClass },
        prtOrganizationCD: { val: prtOrganizationCD },
        addr: { val: addr },
        validStartDT: { val: validStartDT },
        validEndDT: { val: validEndDT },
        operationDate: { val: operationDate },
        userID: { val: userID }
    };
    SQL = `INSERT INTO TB_ITCUST(CUST_GB, CUST_CD ,CUST_NM, CUST_NM_ENG, BRANCH_NM, BRANCH_NM_ENG, CO_RGST_NO, BIZ_CG_CD, PRT_CUST_GB, PRT_CUST_CD, ADDR, VALID_START_DT, VALID_END_DT, SYS_DTIM, WORK_ID) VALUES (:classFication, :custCD, :custNM, :custNMENG, :custBranchNM, :custBranchNM_EN, :coRgstNo, :industryCD, :prtOrganizationClass, :prtOrganizationCD, :addr, :validStartDT, :validEndDT, :operationDate, :userID)`;
    queryOracel(res, SQL, param, optionInsert);
};

exports.editCust = async function (req, res) {
    var classFication = req.body.classFication;
    var custCD = req.body.custCD;
    var custNM = req.body.custNM;
    var custNMENG = req.body.custNMENG;
    var custBranchNM = req.body.custBranchNM;
    var custBranchNM_EN = req.body.custBranchNM_EN;
    var coRgstNo = req.body.coRgstNo;
    var industryCD = req.body.industryCD;
    var prtOrganizationClass = req.body.prtOrganizationClass;
    var prtOrganizationCD = req.body.prtOrganizationCD;
    var addr = req.body.addr;
    var validStartDT = req.body.validStartDT;
    var validEndDT = req.body.validEndDT;
    var operationDate = req.body.operationDate;
    var userID = req.body.userID;
    var option = { autoCommit: true };
    var param = {
        classFication: { val: classFication },
        custCD: { val: custCD },
        custNM: { val: custNM },
        custNMENG: { val: custNMENG },
        custBranchNM: { val: custBranchNM },
        custBranchNM_EN: { val: custBranchNM_EN },
        coRgstNo: { val: coRgstNo },
        industryCD: { val: industryCD },
        prtOrganizationClass: { val: prtOrganizationClass },
        prtOrganizationCD: { val: prtOrganizationCD },
        addr: { val: addr },
        validStartDT: { val: validStartDT },
        validEndDT: { val: validEndDT },
        operationDate: { val: operationDate },
        userID: { val: userID }
    };
    SQL = `UPDATE TB_ITCUST SET CUST_GB = :classFication ,CUST_NM = :custNM , CUST_NM_ENG = :custNMENG, BRANCH_NM = :custBranchNM, BRANCH_NM_ENG = :custBranchNM_EN, CO_RGST_NO = :coRgstNo, BIZ_CG_CD = :industryCD , PRT_CUST_GB = :prtOrganizationClass, PRT_CUST_CD = :prtOrganizationCD, ADDR = :addr, VALID_START_DT = :validStartDT, VALID_END_DT = :validEndDT, SYS_DTIM = :operationDate, WORK_ID = :userID WHERE CUST_CD = :custCD`;
    queryOracel(res, SQL, param, option);
};


