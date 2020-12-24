const oracledb = require('oracledb');
const moment = require('moment');
const dbconfig = require('../../shared/config/dbconfig');

const convertTime = require('../util/dateutil');
const niceGoodCode = require('../../shared/util/niceGoodCode');
const ipGateWay = require('../../shared/util/getIPGateWay');
const _ = require('lodash');

async function getSimpleLimit(req) {
    let connection;

    try {
        let less1Y = 0.8
		let more1Y_less5Y = 1.0
		let more5Y_less10Y = 1.2
		let over10Y = 1.5
		let simpleLimit = 0
		let adjMonIncome = 0;
		let years = moment().diff(req.joinDate, 'years');
		
		if(years <= 1){
			adjMonIncome = less1Y*req.salary
		}else if(1 < years && years <= 5){
			adjMonIncome = more1Y_less5Y*req.salary
		}else if(5 < years && years <= 10){
			adjMonIncome = more5Y_less10Y*req.salary
		}else if(years > 10){
			adjMonIncome = over10Y*req.salary
		}
		
		if(adjMonIncome >= 15000000) {
			simpleLimit = 20000000
		}else if(adjMonIncome >= 12000000 && 15000000 < adjMonIncome ) {
			simpleLimit = 17000000
		}else if(adjMonIncome >= 10000000 && 12000000 < adjMonIncome ) {
			simpleLimit = 15000000
		}else if(adjMonIncome >= 7000000  && 10000000 < adjMonIncome) {
			simpleLimit = 12000000
		}else if(adjMonIncome >= 5000000 && 7000000 < adjMonIncome) {
			simpleLimit = 10000000
		}else if(adjMonIncome >= 3000000 && 5000000 < adjMonIncome) {
			simpleLimit = 7000000
		}else if(adjMonIncome >= 1000000 && 3000000 < adjMonIncome) {
			simpleLimit = 5000000
		}else if(adjMonIncome > 1000000) {
			simpleLimit = 1000000
		}
        

		console.log("adjMonIncome::", adjMonIncome);


        return simpleLimit;
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


module.exports.getSimpleLimit = getSimpleLimit;
