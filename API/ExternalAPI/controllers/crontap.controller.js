const httpClient = require('../services/httpClient.service');
module.exports.start = function () {
    setInterval(() => {
        cronFunction();
    }, 180000);
}

function cronFunction() {
    let url = 'https://localhost:3000/external/OKF_SPL_RQST';
    let body = {
        "fiSessionKey": "SPL2021020800002",
        "fiCode": "B100000011",
        "taskCode": "OKF_SPL_RQST",
        "customerNumber": "CUST0000001001",
        "name": "TEST",
        "sex": "F",
        "mobilePhoneNumber": "0964785596",
        "natId": "012345678",
        "salary": "5000000",
        "joinYearMonth": "202005",
        "infoProvConcent": "Y"
    }

    httpClient.superagentPost(url, body, '').then();
    httpClient.superagentPost(url, body, '').then();
    httpClient.superagentPost(url, body, '').then();
}