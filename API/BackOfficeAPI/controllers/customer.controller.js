const dateFormat = require('dateformat');
const oracledb = require('oracledb');
const oracelService = require('../services/oracelQuery.service');
let _ = require('lodash');
const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };
exports.getCustInfo = async function (req, res) {
    let custClassicfication = req.body.custClassicfication ? '%' + req.body.custClassicfication + '%' : '';
    let cusCd = req.body.cusCd ? '%' + req.body.cusCd + '%' : '';
    let custNm = req.body.custNm ? '%' + req.body.custNm + '%' : '';
    let status = req.body.status ? req.body.status : '';
    let currentLocation = req.body.currentLocation;
    let limitRow = req.body.limitRow;
    let SQL_SELECT = `SELECT 
    CUST_GB as CUST_GB, 
    CUST_CD as CUST_CD, 
    CUST_NM as CUST_NM, 
    STATUS as STATUS, 
    CUST_NM_ENG as CUST_NM_ENG, 
    BRANCH_NM as BRANCH_NM, 
    BRANCH_NM_ENG as BRANCH_NM_ENG, 
    CO_RGST_NO as CO_RGST_NO, 
    BIZ_CG_CD as BIZ_CG_CD, PRT_CUST_GB as PRT_CUST_GB,
     PRT_CUST_CD as PRT_CUST_CD, 
     ADDR as ADDR,to_char(to_date(VALID_START_DT, 'yyyymmdd'),'yyyy/mm/dd') AS VALID_START_DT,to_char(to_date(VALID_END_DT, 'yyyymmdd'),'yyyy/mm/dd') AS VALID_END_DT, to_char(to_date(SYS_DTIM, 'YYYY/MM/DD HH24:MI:SS'),'yyyy/mm/dd hh24:mi:ss') AS SYS_DTIM, WORK_ID as WORK_ID `;
    let SQL_SELECT_COUNT = `SELECT COUNT(*) AS total FROM `;
    let UNION_ALL = 'UNION ALL ';
    let SQL_FROM_ACTIVE = 'FROM TB_ITCUST ';
    let SQL_FROM_HISTORY = 'FROM TB_ITCUST_HIST ';
    let SQL_ORDER_BY = 'ORDER BY CUST_NM_ENG ';
    let SQL_LIMIT = 'OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';

    if (_.isEmpty(custClassicfication) && _.isEmpty(cusCd) && _.isEmpty(custNm) && _.isEmpty(status)) {
        let sql = SQL_SELECT + SQL_FROM_ACTIVE + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT + SQL_FROM_ACTIVE + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + ')';
        let paramSearch = {};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});

    }

    if ((custClassicfication) && (cusCd) && (custNm) && (status)) {
        let SQL_WHERE_SEARCH;
        if (status[0] == 0) {
             SQL_WHERE_SEARCH = 'WHERE CUST_GB LIKE :custClassicfication ' +
                'AND LOWER(CUST_CD) LIKE LOWER(:cusCd) ' +
                `AND LOWER(CUST_NM_ENG) LIKE LOWER(:custNm) OR STATUS IS NULL AND STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) `;
        } else {
             SQL_WHERE_SEARCH = 'WHERE CUST_GB LIKE :custClassicfication ' +
                'AND LOWER(CUST_CD) LIKE LOWER(:cusCd) ' +
                `AND LOWER(CUST_NM_ENG) LIKE LOWER(:custNm) AND STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) `;
        }
        let sql = SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            custClassicfication,
            cusCd,
            custNm,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + ')';
        let paramSearch = {
            custClassicfication,
            cusCd,
            custNm,
        };
        let totalRow;
        let rowRs;
        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if ((custClassicfication) && _.isEmpty(cusCd) && _.isEmpty(custNm) && _.isEmpty(status)) {
        let SQL_WHERE_SEARCH = 'WHERE CUST_GB LIKE :custClassicfication ';
        let sql = SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            custClassicfication,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + ')';
        let paramSearch = {
            custClassicfication,
        };
        let totalRow;
        let rowRs;
        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if (_.isEmpty(custClassicfication) && (cusCd) && _.isEmpty(custNm) && _.isEmpty(status)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(CUST_CD) LIKE LOWER(:cusCd) ';
        let sql = SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            cusCd,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + ')';
        let paramSearch = {
            cusCd,
        };
        let totalRow;
        let rowRs;
        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if (_.isEmpty(custClassicfication) && _.isEmpty(cusCd) && (custNm) && _.isEmpty(status)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(CUST_NM_ENG) LIKE LOWER(:custNm) ';
        let sql = SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            custNm,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + ')';
        let paramSearch = {
            custNm,
        };
        let totalRow;
        let rowRs;
        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }



    if (_.isEmpty(custClassicfication) && _.isEmpty(cusCd) && _.isEmpty(custNm) && (status)) {
        let SQL_WHERE_SEARCH ;
        if (status[0] == 0) {
            SQL_WHERE_SEARCH = ` WHERE STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR STATUS IS NULL `;
        } else {
            SQL_WHERE_SEARCH = ` WHERE STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) `;
        }
        let sql = SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + ')';
        let paramSearch = {
        };
        let totalRow;
        let rowRs;
        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if ((custClassicfication) && (cusCd) && _.isEmpty(custNm) && _.isEmpty(status)) {
        let SQL_WHERE_SEARCH = 'WHERE CUST_GB LIKE :custClassicfication AND LOWER(CUST_CD) LIKE LOWER(:cusCd) ';
        let sql = SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            custClassicfication,
            cusCd,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + ')';
        let paramSearch = {
            custClassicfication,
            cusCd,
        };
        let totalRow;
        let rowRs;
        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if ((custClassicfication) && _.isEmpty(cusCd) && (custNm)  && _.isEmpty(status)) {
        let SQL_WHERE_SEARCH = 'WHERE CUST_GB LIKE :custClassicfication AND LOWER(CUST_NM_ENG) LIKE LOWER(:custNm) ';
        let sql = SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            custClassicfication,
            custNm,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + ')';
        let paramSearch = {
            custClassicfication,
            custNm,
        };
        let totalRow;
        let rowRs;
        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if ((custClassicfication) && _.isEmpty(cusCd) && _.isEmpty(custNm)  && (status)) {
        let SQL_WHERE_SEARCH ;
        if (status[0] == 0) {
            SQL_WHERE_SEARCH = ` WHERE CUST_GB LIKE :custClassicfication AND STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR STATUS IS NULL `;
        } else {
            SQL_WHERE_SEARCH = ` WHERE CUST_GB LIKE :custClassicfication AND STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) `;
        }
        let sql = SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            custClassicfication,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + ')';
        let paramSearch = {
            custClassicfication,
        };
        let totalRow;
        let rowRs;
        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if (_.isEmpty(custClassicfication) && (cusCd) && (custNm) && _.isEmpty(status)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(CUST_CD) LIKE LOWER(:cusCd) AND LOWER(CUST_NM_ENG) LIKE LOWER(:custNm) ';
        let sql = SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            cusCd,
            custNm,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + ')';
        let paramSearch = {
            cusCd,
            custNm,
        };
        let totalRow;
        let rowRs;
        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if (_.isEmpty(custClassicfication) && (cusCd) && _.isEmpty(custNm) && (status)) {
        let SQL_WHERE_SEARCH ;
        if (status[0] == 0) {
            SQL_WHERE_SEARCH = `WHERE LOWER(CUST_CD) LIKE LOWER(:cusCd) AND STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR STATUS IS NULL `;
        } else {
            SQL_WHERE_SEARCH = `WHERE LOWER(CUST_CD) LIKE LOWER(:cusCd) AND STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) `;
        }
        let sql = SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            cusCd,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + ')';
        let paramSearch = {
            cusCd,
        };
        let totalRow;
        let rowRs;
        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if (_.isEmpty(custClassicfication) && _.isEmpty(cusCd) && (custNm) && (status)) {
        let SQL_WHERE_SEARCH ;
        if (status[0] == 0) {
            SQL_WHERE_SEARCH = `WHERE LOWER(CUST_NM_ENG) LIKE LOWER(:custNm) AND STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR STATUS IS NULL `;
        } else {
            SQL_WHERE_SEARCH = `WHERE LOWER(CUST_NM_ENG) LIKE LOWER(:custNm) AND STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) `;
        }
        let sql = SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            custNm,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + ')';
        let paramSearch = {
            custNm,
        };
        let totalRow;
        let rowRs;
        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }


    if ((custClassicfication) && (cusCd) && (custNm) && _.isEmpty(status)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(CUST_NM_ENG) LIKE LOWER(:custNm) AND CUST_GB LIKE :custClassicfication AND LOWER(CUST_CD) LIKE LOWER(:cusCd) ';
        let sql = SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            custNm,
            cusCd,
            custClassicfication,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + ')';
        let paramSearch = {
            custNm,
            cusCd,
            custClassicfication,
        };
        let totalRow;
        let rowRs;
        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }


    if (_.isEmpty(custClassicfication) && (cusCd) && (custNm) && (status)) {
        let SQL_WHERE_SEARCH ;
        if (status[0] == 0) {
            SQL_WHERE_SEARCH = `WHERE LOWER(CUST_NM_ENG) LIKE LOWER(:custNm) AND STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR STATUS IS NULL AND LOWER(CUST_CD) LIKE LOWER(:cusCd) `;
        } else {
            SQL_WHERE_SEARCH = `WHERE LOWER(CUST_NM_ENG) LIKE LOWER(:custNm) AND STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")})  AND LOWER(CUST_CD) LIKE LOWER(:cusCd) `;
        }
        let sql = SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            custNm,
            cusCd,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + ')';
        let paramSearch = {
            custNm,
            cusCd,
        };
        let totalRow;
        let rowRs;
        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }


    if ((custClassicfication) && _.isEmpty(cusCd) && (custNm) && (status)) {
        let SQL_WHERE_SEARCH ;
        if (status[0] == 0) {
            SQL_WHERE_SEARCH = `WHERE LOWER(CUST_NM_ENG) LIKE LOWER(:custNm) AND STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR STATUS IS NULL AND CUST_GB LIKE :custClassicfication `;
        } else {
            SQL_WHERE_SEARCH = `WHERE LOWER(CUST_NM_ENG) LIKE LOWER(:custNm) AND STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")})  AND CUST_GB LIKE :custClassicfication `;
        }
        let sql = SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            custNm,
            custClassicfication,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + ')';
        let paramSearch = {
            custNm,
            custClassicfication,
        };
        let totalRow;
        let rowRs;
        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }


    if ((custClassicfication) && (cusCd) && _.isEmpty(custNm) && (status)) {
        let SQL_WHERE_SEARCH ;
        if (status[0] == 0) {
            SQL_WHERE_SEARCH = `WHERE LOWER(CUST_CD) LIKE LOWER(:cusCd) AND STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR STATUS IS NULL AND CUST_GB LIKE :custClassicfication `;
        } else {
            SQL_WHERE_SEARCH = `WHERE LOWER(CUST_CD) LIKE LOWER(:cusCd) AND STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")})  AND CUST_GB LIKE :custClassicfication `;
        }
        let sql = SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            cusCd,
            custClassicfication,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT + SQL_FROM_ACTIVE + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT + SQL_FROM_HISTORY + SQL_WHERE_SEARCH + ')';
        let paramSearch = {
            cusCd,
            custClassicfication,
        };
        let totalRow;
        let rowRs;
        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
};

exports.addCust = async function (req, res) {
    let classFication = req.body.classFication;
    let custCD = req.body.custCD;
    let custNM = req.body.custNM;
    let custNMENG = req.body.custNMENG;
    let custBranchNM = req.body.custBranchNM;
    let custBranchNM_EN = req.body.custBranchNM_EN;
    let coRgstNo = req.body.coRgstNo;
    let industryCD = req.body.industryCD;
    let prtOrganizationClass = req.body.prtOrganizationClass;
    let prtOrganizationCD = req.body.prtOrganizationCD;
    let addr = req.body.addr;
    let validStartDT = (_.isEmpty(req.body.validStartDT)) ? null: req.body.validStartDT.replace(/[^0-9 ]/g, "");
    let validEndDT = (_.isEmpty(req.body.validEndDT)) ? null: req.body.validEndDT.replace(/[^0-9 ]/g, "");
    let operationDate = dateFormat(new Date(), "yyyymmddHHMMss");
    let userID = req.body.userID;
    let status = 1;
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
        userID: { val: userID },
        status: {val: status}
    };
    let paramCheckCustomer = {
        classFication: { val: classFication },
        custCD: { val: custCD },
    }
    let SQL_CHECK_CUST = 'SELECT * FROM TB_ITCUST WHERE CUST_GB = :classFication AND CUST_CD = :custCD '
    let SQL = `INSERT INTO TB_ITCUST(CUST_GB, CUST_CD ,CUST_NM, CUST_NM_ENG, BRANCH_NM, BRANCH_NM_ENG, CO_RGST_NO, BIZ_CG_CD, PRT_CUST_GB, PRT_CUST_CD, ADDR, VALID_START_DT, VALID_END_DT, SYS_DTIM, WORK_ID, STATUS) VALUES (:classFication, :custCD, :custNM, :custNMENG, :custBranchNM, :custBranchNM_EN, :coRgstNo, :industryCD, :prtOrganizationClass, :prtOrganizationCD, :addr, :validStartDT, :validEndDT, :operationDate, :userID, :status)`;
    let resultCheckExistCustomer = await oracelService.getCustomerByID(res, SQL_CHECK_CUST , paramCheckCustomer ,optionFormatObj);
    if (resultCheckExistCustomer[0]) {
        res.status(500).send({message: 'Customer already exist!'});
    } else {
        await oracelService.queryOracel(res, SQL, param, optionAutoCommit);
    }
};

exports.editCust = async function (req, res) {
    let classFication = req.body.classFication;
    let custCD = req.body.custCD;
    let custNM = req.body.custNM;
    let custNMENG = req.body.custNMENG;
    let custBranchNM = req.body.custBranchNM;
    let custBranchNM_EN = req.body.custBranchNM_EN;
    let coRgstNo = req.body.coRgstNo;
    let industryCD = req.body.industryCD;
    let prtOrganizationClass = req.body.prtOrganizationClass;
    let prtOrganizationCD = req.body.prtOrganizationCD;
    let addr = req.body.addr;
    let validEndDT = (_.isEmpty(req.body.validEndDT)) ? null: req.body.validEndDT.replace(/[^0-9 ]/g, "");
    let validStartDT = (_.isEmpty(req.body.validStartDT)) ? null: req.body.validStartDT.replace(/[^0-9 ]/g, "");
    let status = req.body.status;
    let operationDate = dateFormat(new Date(), "yyyymmddHHMMss");
    if (status == 2) {
        status = null;
    }

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
        validEndDT: { val: validEndDT },
        status: {val: status},
        operationDate: {val: operationDate},
    };
    let SQL = `UPDATE TB_ITCUST SET CUST_NM = :custNM , CUST_NM_ENG = :custNMENG, BRANCH_NM = :custBranchNM, BRANCH_NM_ENG = :custBranchNM_EN, CO_RGST_NO = :coRgstNo, BIZ_CG_CD = :industryCD , PRT_CUST_GB = :prtOrganizationClass, PRT_CUST_CD = :prtOrganizationCD, ADDR = :addr, VALID_END_DT = :validEndDT, SYS_DTIM = :operationDate , STATUS = :status WHERE CUST_GB = :classFication AND CUST_CD = :custCD  `;
    await oracelService.queryOracel(res, SQL, param, optionAutoCommit);
};


