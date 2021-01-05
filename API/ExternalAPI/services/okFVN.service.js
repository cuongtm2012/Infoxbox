const moment = require('moment');
const _ = require('lodash');

async function getSimpleLimit(req) {
    let connection;

    try {
        let less3Y = 1.2
		let more3Y = 1.5
		//console.log("joinYearMonth:" , req.joinYearMonth)
		let years = moment().diff(moment(req.joinYearMonth, 'YYYYMM'), 'years');
		let simpleLimit = 0
		let adjMonIncome = 0;
		if(years < 3){
			adjMonIncome = less3Y*req.salary
		}else if(years >= 3){
			adjMonIncome = more3Y*req.salary
		}
		
		//console.log("years:" , years)
		//console.log("adjMonIncome:" , adjMonIncome)
		
		
		if(adjMonIncome >= 15000000) {
			simpleLimit = 20000000
		}else if(adjMonIncome >= 10000000 && adjMonIncome  < 15000000 ) {
			simpleLimit = 15000000
		}else if(adjMonIncome >= 7000000 && adjMonIncome < 10000000) {
			simpleLimit = 10000000
		}else if(adjMonIncome < 7000000) {
			simpleLimit = 5000000
		}
        

		//console.log("adjMonIncome::", adjMonIncome);


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
