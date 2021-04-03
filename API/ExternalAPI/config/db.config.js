import oracledb from'oracledb';
import dbconfig from'../../shared/config/dbconfig.js';
import config from'./config.js';

const dbOption = {
	user: dbconfig.user,
	password: dbconfig.password,
	connectString: dbconfig.connectString,
	poolAlias: config.poolAlias,
	poolMax: 4, // maximum size of the pool
	poolMin: 0, // let the pool shrink completely
	poolIncrement: 1, // only grow the pool by one connection at a time
	poolTimeout: 0  // never terminate idle connections
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

export default initialize;