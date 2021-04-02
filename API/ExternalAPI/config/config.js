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
	},

	configCacheAxios: {
		disabled: process.env.AXIOS_DNS_DISABLE === 'true',
		dnsTtlMs: process.env.AXIOS_DNS_CACHE_TTL_MS || 5000, // when to refresh actively used dns entries (5 sec)
		cacheGraceExpireMultiplier: process.env.AXIOS_DNS_CACHE_EXPIRE_MULTIPLIER || 2, // maximum grace to use entry beyond TTL
		dnsIdleTtlMs: process.env.AXIOS_DNS_CACHE_IDLE_TTL_MS || 1000 * 60 * 60, // when to remove entry entirely if not being used (1 hour)
		backgroundScanMs: process.env.AXIOS_DNS_BACKGROUND_SCAN_MS || 2400, // how frequently to scan for expired TTL and refresh (2.4 sec)
		dnsCacheSize: process.env.AXIOS_DNS_CACHE_SIZE || 100, // maximum number of entries to keep in cache
		// pino logging options
		logging: {
			name: 'axios-cache-dns-resolve',
			// enabled: true,
			level: process.env.AXIOS_DNS_LOG_LEVEL || 'info', // default 'info' others trace, debug, info, warn, error, and fatal
			// timestamp: true,
			prettyPrint: process.env.NODE_ENV === 'DEBUG' || false,
			useLevelLabels: true,
		},
	}
};

// module.exports = config;
export default config;