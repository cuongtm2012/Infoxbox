const axios = require('axios');
const db = require('../config/db.config.js');
const Customer = db.customers;

const oracledb = require('oracledb');
const dbconfig = require('../config/dbconfig');

const Cics11aModelReq = require('../domain/customer.request');

const logger = require('../shared/logs/logger');

// Post a Customer
exports.create = (req, res) => {
    // Save to MariaDB database
    Customer.create({
        cusName: req.body.name,
        cusAge: req.body.age,
        cusAdd: req.body.add
    })
        .then(customer => {
            // Send created customer to client
            res.json(customer);
        })
        .catch(error => res.status(400).send(error))
};

// Fetch all Customers
exports.findAll = (req, res) => {
    Customer.findAll(
        {
            attributes: {
                exclude: []
            }
        })
        .then(customers => {
            res.json(customers);
        })
        .catch(error => res.status(400).send(error))
};

// Find a Customer by Id
exports.findById = (req, res) => {
    Customer.findById(req.params.customerId,
        { attributes: { exclude: ["createdAt", "updatedAt"] } }
    )
        .then(customer => {
            if (!customer) {
                return res.status(404).json({ message: "Customer Not Found" })
            }
            return res.status(200).json(customer)
        }
        )
        .catch(error => res.status(400).send(error));
};

async function runSelectById(req, res) {
    console.log("req", req.body);
    var requestData = {
        name: req.body.name,
        age: req.body.age,
        add: req.body.address
    };

    const getdataReq = new Cics11aModelReq(requestData);
    JSON.stringify(getdataReq);

    let connection;

    try {
        let sql, binds, options, result;

        connection = await oracledb.getConnection(dbconfig);

        sql = `SELECT CUS_AGE, CUS_NM, CUS_ADD
        FROM TB_CUSTOMER`;
        // where CUS_ID = :CUS_ID`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {},
            // [1],
            // The "bind value" 3 for the bind variable ":idbv"
            // Options argument.  Since the query only returns one
            // row, we can optimize memory usage by reducing the default
            // maxRows value.  For the complete list of other options see
            // the documentation.
            {
                // maxRows: 1,
                 outFormat: oracledb.OUT_FORMAT_OBJECT  // query result format
                //, extendedMetaData: true                 // get extra metadata
                //, fetchArraySize: 100                    // internal buffer allocation size for tuning
            });

        console.log("row::", result.rows)
        return result.rows;
        // return res.status(200).json(result.rows);


    } catch (err) {
        console.log(err);
        return res.status(400);
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

/*
 ** prameters request
 ** insert to customer table
*/
async function runInsert(req, res) {
    console.log("reqinsert:::", req.body);
    var requestData = {
        name: req.body.name,
        age: req.body.age,
        add: req.body.add
    };

    const getdataReq = new Cics11aModelReq(requestData);
    JSON.stringify(getdataReq);

    let connection;

    try {
        let sql, binds, options, result;

        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_CUSTOMER(CUS_AGE, CUS_NM, CUS_ADD) VALUES(:CUS_AGE, :CUS_NM, :CUS_ADD)`;

        // 'bind by name' syntax
        result = await connection.execute(
            sql,
            {
                CUS_AGE: { val: getdataReq.age },
                CUS_NM: { val: getdataReq.name },
                CUS_ADD: { val: getdataReq.add }
            },
            { autoCommit: true }  // commit once for all DML in the script
        );

        console.log("Number of rows inserted:", result.rowsAffected);
        // return result.rowsAffected;
        return res.status(200).json(result.rowsAffected);
        // var data = new cics11aModelRes(result.rows[0], result.rows[0]);
        // console.log("log data output")
        // console.log(data)
        // logger.debug('LogFindAl; from routes after manage request');
        // logger.debug(data);
        // return res.status(200).json(data)


    } catch (err) {
        console.log(err);
        return res.status(400);
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

module.exports.runSelectById = runSelectById;
module.exports.runInsert = runInsert;