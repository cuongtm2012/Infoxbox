const httpClient = require('../services/httpClient.service');
module.exports.start = function () {
    setInterval(() => {
        cronFunction();
    }, 180000);
}

function cronFunction() {
    try {
        let url = 'https://localhost:3000/external/OKF_SPL_RQST';
        let body = {
            "fiSessionKey": "TEST",
            "fiCode": "B100000011",
            "taskCode": "OKF_SPL_RQST",
            "customerNumber": "TEST",
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
    } catch (e) {
        console.log(e.toString());
    }
}