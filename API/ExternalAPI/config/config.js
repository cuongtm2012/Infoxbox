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
		port: '3100'
	},
	log: {
		orgLog: '../../logs/External'
	},
	batch: {
		TIME_OUT: 5000
	},
	authprefix: 'Bearer ',
	jwtExpiresIn: 864000000000,
	secret: 'apisecretinfoplus12!@',
	VmgToken: {
		Dev_Token: '7be47eee76c88f4d2c698d6575cd8155'
	},
	AccountFptDev: {
		username: "nice",
		password: "nice@123"
	}
};

module.exports = config;
