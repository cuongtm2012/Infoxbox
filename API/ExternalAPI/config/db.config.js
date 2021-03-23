const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');
const config = require('./config')

const dbOption = {
	user: dbconfig.user,
	password: dbconfig.password,
	connectString: dbconfig.connectString,
	poolAlias: config.poolAlias,
	poolMax: 10, // maximum size of the pool
	poolMin: 10, // let the pool shrink completely
	poolIncrement: 0, // only grow the pool by one connection at a time
	poolTimeout: 60  // never terminate idle connections
}

async function initialize() {
	//create oracle connection pool
	await oracledb.createPool(
			dbOption,
			function (err, pool) {
				if (err) {
					console.error("createPool() error: " + err.message);
					throw err;
				}
			}
		);//end oracledb.createpool
}
module.exports.initialize = initialize;
module.exports.dbOption = dbOption;