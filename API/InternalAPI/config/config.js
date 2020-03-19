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
		port: '3200'
	},
	log: {
		orgLog: '../../logs/Internal'
	},
	batch: {
		TIME_OUT: 1 * 60 * 1000, //B0002 jov
		TIME_OUT1: 3 * 60 * 1000, //B0003
		TIME_OUT2: 30 * 60 * 1000, //Job no exist
		TIME_OUT3: 20 * 1000, // Mobile A0001
		TIME_OUT_DELAY: 30 * 60 * 1000 // DelayReport 1h

	},
	authprefix: 'Bearer ',
	jwtExpiresIn: 864000000000,
	secret: 'apisecretinfoplus12!@',
};

module.exports = config;
