
let oracledb = require('oracledb');
let dbconfig = require('../../shared/config/dbconfig');
var _ = require('lodash');
const config = require('../config/config');
exports.queryOracel = async function (res, sql, param, option) {
    let connection;
    try {
        connection = await oracledb.getConnection(config.poolAlias);
        let result = await connection.execute(
            sql, param, option);
        if (!(result.rows === undefined)) {
            res.status(200).send(result.rows)
        } else {
            res.status(200).send(result);
        }
    } catch (err) {
        if (err.errorNum == 2292) {
            res.status(501).send(err);
        } else {
            res.status(500).send(err);
        }
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

exports.queryGetTotalRow = async function (res, sql, param, option) {
    let connection;
    try {
        connection = await oracledb.getConnection(config.poolAlias);
        let result = await connection.execute(
            sql, param, option);
        if (!(result.rows === undefined)) {
            return result.rows;
        }
    } catch (err) {
        return err;
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


exports.checkIsExistUserID = async function (res, sql, param, option) {
    try {
        this.connection = await oracledb.getConnection(config.poolAlias);
        let result = await this.connection.execute(
            sql, param, option);
        
        if (!(result.rows === undefined)) {
            return result.rows;
        }
    } catch (err) {
        return err;
    } finally {
        if (this.connection) {
            try {
                await this.connection.close();
            } catch (error) {
                console.log(error);
            }
        }
    }
};


exports.checkExistContract = async function (res, sql, param, option) {
    try {
        this.connection = await oracledb.getConnection(config.poolAlias);
        let result = await this.connection.execute(
            sql, param, option);
        
        if (!(result.rows === undefined)) {
            return result.rows;
        }
    } catch (err) {
        return res.status(500).send(err);
    } finally {
        if (this.connection) {
            try {
                await this.connection.close();
            } catch (error) {
                console.log(error);
            }
        }
    }
};


exports.createUser = async function (res, sql, param, option) {
    try {
        this.connection = await oracledb.getConnection(config.poolAlias);
        let result = await this.connection.execute(
            sql, param, option);
        
        if (!(result === undefined)) {
            return result;
        }
    } catch (err) {
        return err;
    } finally {

        if (this.connection) {
            try {
                await this.connection.close();
            } catch (error) {
                console.log(error);
            }
        }
    }
};

exports.getUserByUserID = async function (res, sql, param, option) {
    try {
        this.connection = await oracledb.getConnection(config.poolAlias);
        let result = await this.connection.execute(
            sql, param, option);
        
        if (!(result.rows === undefined)) {
            return result.rows;
        }
    } catch (err) {
        return err;
    } finally {

        if (this.connection) {
            try {
                await this.connection.close();
            } catch (error) {
                console.log(error);
            }
        }
    }
};

exports.getCustomerByID = async function (res, sql, param, option) {
    try {
        this.connection = await oracledb.getConnection(config.poolAlias);
        let result = await this.connection.execute(
            sql, param, option);
        
        if (!(result.rows === undefined)) {
            return result.rows;
        }
    } catch (err) {
        return err;
    } finally {

        if (this.connection) {
            try {
                await this.connection.close();
            } catch (error) {
                console.log(error);
            }
        }
    }
};

exports.setRole = async function (res, sql, param, option) {
    try {
        this.connection = await oracledb.getConnection(config.poolAlias);
        let result = await this.connection.execute(
            sql, param, option);
        if (result) {
            res.status(200).send({message: 'Create User Successful'})
        } else {
            res.status(200).send({message: 'Error when create User'});
        }
    } catch (err) {
        return err;
    } finally {

        if (this.connection) {
            try {
                await this.connection.close();
            } catch (error) {
                console.log(error);
            }
        }
    }
};

exports.queryAndReturnData = async function (res, sql, param, option) {
    try {
        this.connection = await oracledb.getConnection(config.poolAlias);
        let result = await this.connection.execute(
            sql, param, option);
        if (result.rows) {
            return result.rows;
        } else {
            return null;
        }
    } catch (err) {
        return err;
    } finally {

        if (this.connection) {
            try {
                await this.connection.close();
            } catch (error) {
                console.log(error);
            }
        }
    }
};

