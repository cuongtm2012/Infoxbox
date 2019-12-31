var config = {
	database: {
		host: '1.55.215.214',
		user: 'root',
		password: 'infocity12!@',
		port: 3969,
		database: 'scrap',
		dialect: 'mysql',
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000
		  }
	},
	server: {
		host: '127.0.0.1',
		port: '3000'
	},
	log: {
		orgLog: '../../logs/Internal'
	},
	batch: {
		TIME_OUT: 30000, // 30 seconds
		TIME_OUT2: 900000, // 15 minutes
	},
	authprefix: 'Bearer ',
	jwtExpiresIn: 864000000000,
	secret: 'apisecretinfoplus12!@',
};

module.exports = config;