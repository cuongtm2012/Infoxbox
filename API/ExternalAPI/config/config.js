const config = {
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
		Dev_Token: '7be47eee76c88f4d2c698d6575cd8155',
		Prod_Token: '72aab4aa1f1dc32734d71852c5a0c91e'
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
		DEV_clientsecret: 'be_group',
		PROD_username: 'support@okevay.vn',
		PROD_password: 'okfin@1234',
		PROD_clientid: 'nice_group',
		PROD_clientsecret: 'nice_group'
	},

	serviceNameOKF: 'OKF_CSS_ASS',

	accountZaloDev: {
		username: 'agency',
		password: 'password'
	},

	ZaloAesKey: {
		DEV: 'Y6/YUVowyH0o7erULHw/Uw==',
		PROD: 'uRx0k4x8xmhyrhaSQnAAog=='
	},

	accountZaloProduction: {
		username: 'OF-W0D8wAPGpqXZPG',
		password: '5fGm2gKzQo0SdmvLy6a08XYT0r_qR0WlsiSwH8COAWW'
	},

	Vmg_Kyc_2: {
		DEV_cmd: 'kyc2_nice',
		DEV_serviceCode: 'kyc2_nice',
		PROD_cmd: 'score_k2.3_nice_okfin',
		PROD_serviceCode: 'score_k2.3_nice_okfin',
	},

	Vmg_RiskScore: {
		DEV_cmd: 'risk_score_nice',
		DEV_serviceCode: 'risk_score_nice',
		PROD_cmd: 'risk_score_nice_okfin',
		PROD_serviceCode: 'risk_score_nice_okfin',
	},

	Vmg_CAC_1: {
		DEV_cmd: 'cac1_nice',
		DEV_customerCode: 'NICE',
		DEV_serviceCode: 'cac1_nice'
	},

	poolAlias: 'Pool',

	requestTimeOut: {
		applicationJson: 60000,
		applicationFormData: 100000
	}
};

export default config;
