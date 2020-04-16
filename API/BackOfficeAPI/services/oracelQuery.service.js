
let oracledb = require('oracledb');
let dbconfig = require('../../shared/config/dbconfig');
var _ = require('lodash');

exports.queryOracel = async function (res, sql, param, option) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbconfig);
        let result = await connection.execute(
            sql, param, option);
        console.log(result);
        if (!(result.rows === undefined)) {
            res.status(200).send(result.rows)
        } else {
            res.status(200).send(result);
        }
    } catch (err) {
        console.log(err);
        res.send({ error: 1 });
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
        connection = await oracledb.getConnection(dbconfig);
        let result = await connection.execute(
            sql, param, option);
        console.log(result);
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


exports.checkIsExistUserName = async function (res, sql, param, option) {
    try {
        this.connection = await oracledb.getConnection(dbconfig);
        let result = await this.connection.execute(
            sql, param, option);
        console.log(result);
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


exports.createUser = async function (res, sql, param, option) {
    try {
        this.connection = await oracledb.getConnection(dbconfig);
        let result = await this.connection.execute(
            sql, param, option);
        console.log(result);
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

exports.getUserByUserNameAndUserID = async function (res, sql, param, option) {
    try {
        this.connection = await oracledb.getConnection(dbconfig);
        let result = await this.connection.execute(
            sql, param, option);
        console.log(result);
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
        this.connection = await oracledb.getConnection(dbconfig);
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

