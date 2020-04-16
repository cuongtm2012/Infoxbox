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
		port: '3400'
	},
	email: {
		service: 'Gmail',
		user: 'cuong8888q@gmail.com',
		password: 'vanthe010',
		header: '[InfoCity] RESET PIN CODE',
		body: '<p>Hello Mr/Ms. <b>$userName</b>,</p> <p>Your PIN Code has already for active account.</p><p>PIN code is <b>$pincode</b>.</p><p>If there is any request, please contact us by HOTLINE <b>19006198</b> to be supported.</p><p>Regards,</p><p>InfoCity Management.</p>'
	},
	log: {
		orgLog: '../../logs/BackOffice'
	},
	batch: {
		TIME_OUT: 5000
	},
	authprefix: 'Bearer ',
	jwtExpiresIn: 86400,
	secret: 'apisecretinfoplus12!@',
};

module.exports = config;
