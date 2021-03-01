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
		orgSource: '../../logs',
		orgLog: './logs'
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
	},
	SECRET_ZALO_DEV : 'TEST',

	bodyGetAuthEContract: {
		DEV_username: 'jhhan@nicegroup.com.vn',
		DEV_password: 'nice@123',
		DEV_clientid: 'be_group',
		DEV_clientsecret: 'be_group'
	},

	serviceNameOKF: 'OKF_CSS_ASS',

	accountZaloDev: {
		username: 'agency',
		password: 'password'
	},

	ZaloAesKey: {
		DEV: 'Y6/YUVowyH0o7erULHw/Uw=='
	}
};

module.exports = config;
