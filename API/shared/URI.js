var URI = {

    cicInternalJson: 'https://1.234.53.23:9401/rest/extJson',

    internal_cic: 'https://localhost:3300/internal/cic',
    internal_cicB0003: 'https://localhost:3300/internal/cicB0003',
    internal_cicMobile: 'https://localhost:3300/internal/mobile',

    socket_url: 'https://localhost:3400',
    socket_mobile_url: 'https://localhost:3200',

    URL_ZALO_GET_AUTH_DEV: 'https://dev-partner.score.dmp.zaloapp.com/v2/api/agency/auth',
    URL_ZALO_GET_SCORE_DEV: 'https://dev-partner.score.dmp.zaloapp.com/v2/api/agency/score',

    URL_VMG_DEV: {
        host: 'api2-test.infosky.vn',
        path: '/app/info_sky_v2/api/request',
        port: 443
    },

    URL_FPT_DEV: 'https://api.uat.trandata.io/',

    URL_RCLIPS: {
        host: '103.112.124.153',
        path: '/online/rclips/json',
        port: 18082
    },

    URL_E_CONTRACT_GET_TOKEN_ACCESS_DEV: 'https://demo.econtract.fpt.com.vn/app/v1/client-auth/login',

    URL_E_CONTRACT_SUBMIT_INFORMATION_DEV: 'https://demo.econtract.fpt.com.vn/app/services/envelope/api/external/v1/sign',

    URL_E_CONTRACT_GET_STATUS_DEV: 'https://demo.econtract.fpt.com.vn/app/services/envelope/api/external/v1/envelope/status?id=',

    URL_FPT_PROD: 'https://api.trandata.io/',

    URL_ZALO_GET_AUTH_PROD: 'https://partner.score.dmp.zaloapp.com/v2/api/agency/auth',
    URL_ZALO_GET_SCORE_PROD: 'https://partner.score.dmp.zaloapp.com/v2/api/agency/score',

    URL_E_CONTRACT_GET_STRUCTURE_API_DEV: 'https://demo.econtract.fpt.com.vn/app/services/envelope/api/external/v1/template/structue?alias=',
    URL_E_CONTRACT_DOWNLOAD_API_DEV: 'https://demo.econtract.fpt.com.vn/app/services/envelope/api/external/v1/doc/content/',

    URL_E_CONTRACT_GET_TOKEN_ACCESS_PROD: 'https://econtract.fpt.com.vn/app/v1/client-auth/login',

    URL_E_CONTRACT_SUBMIT_INFORMATION_PROD: 'https://econtract.fpt.com.vn/app/services/envelope/api/external/v1/sign',

    URL_E_CONTRACT_GET_STATUS_PROD: 'https://econtract.fpt.com.vn/app/services/envelope/api/external/v1/envelope/status?id=',

    URL_E_CONTRACT_GET_STRUCTURE_API_PROD: 'https://econtract.fpt.com.vn/app/services/envelope/api/external/v1/template/structue?alias=',
    URL_E_CONTRACT_DOWNLOAD_API_PROD: 'https://econtract.fpt.com.vn/app/services/envelope/api/external/v1/doc/content/',

    URL_VMG_PROD: {
        host: 'api-v2.infosky.vn',
        path: '/app/info_sky_v2/api/request',
        port: 443
    },
};

module.exports = URI;
