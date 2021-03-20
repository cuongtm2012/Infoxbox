const cicService = require('../services/cicInternal.service');
const URI = require('../../shared/URI');
const defaultParams = require('../../shared/domain/defaultParams.request');
const _ = require('lodash');
const convertBase64 = require('../../shared/util/convertBase64ToText');
const logger = require('../config/logger');
const cicB0003Req = require('../domain/cicB0003.request');

const axios = require('axios');

const runRestartPm2 = require('../util/runShellScript');
const cicDeplayReportService = require('../services/cicDelayReport.service');
const io = require('socket.io-client');
const dateutil = require('../util/dateutil');

module.exports = class TestLoadServer {
    //Cron request internal scraping
    cron(oncomplete) {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }, timeout: 60 * 1000
        }
const downloadContractUrl = 'https://103.112.124.129:3000/contract/FTN_GCT_RQST?fiCode=B100000011&taskCode=FTN_GCT_RQST&id=000011JlI9Gai43vy912RfWz';
const statusContractUrl = 'https://103.112.124.129:3000/contract/FTN_GAS_RQST?fiCode=B100000011&taskCode=FTN_GAS_RQST&alias=hop_dong_nice_test_0112';
const bodyNfSCore = {
    "appNumber": "",
    "fiCode": "B100000011",
    "taskCode": "OKF_SCO_RQST",
    "customerNumber": "",
    "scoreProduct": "NOK100_001",
    "mobilePhoneNumber": "0964785596",
    "natId": "001096002249",
    "infoProvConcent": "Y"
}
const urlNFScore = 'https://103.112.124.129:3000/external/OKF_SCO_RQST'

const urlCreateContract = 'https://103.112.124.129:3000/contract/FTN_SCD_RQST';
const bodyCreateContract = {
    "fiSessionKey": "",
    "fiCode": "B100000011",
    "taskCode": "FTN_SCD_RQST",
    "templateId": "0000124ef8M8UdJR8z58wsRl",
    "alias": "hop_dong_nice_test_0112",
    "syncType": "sync",
    "datas": [
        {
            "id": "envName",
            "name": "Hợp đồng NiceTest",
            "type": "header_fields",
            "value": "Hợp đồng NiceTest",
            "owner": "envelope_hdr",
            "dataType": "String",
            "required": true
        },
        {
            "id": "envNo",
            "name": "0000001",
            "type": "header_fields",
            "value": "",
            "owner": "envelope_hdr",
            "dataType": "String",
            "required": false
        },
        {
            "id": "envDate",
            "name": "Ngày ký",
            "type": "header_fields",
            "value": "2021-01-12T05:00:00.000Z",
            "owner": "envelope_hdr",
            "dataType": "Date",
            "required": false
        },
        {
            "id": "envSubmittedFrom",
            "name": " Được gửi từ :  ",
            "type": "header_fields",
            "value": "/496/517",
            "owner": "envelope_hdr",
            "dataType": "String",
            "required": false
        },
        {
            "id": "p_001",
            "name": "name_party",
            "type": "p",
            "value": "NICE Viet Nam",
            "owner": "party",
            "dataType": "String",
            "required": true
        },
        {
            "id": "p_001_r_001",
            "name": "name_recipient",
            "type": "r",
            "value": "Mai Anh Tuấn",
            "owner": "recipient",
            "dataType": "String",
            "required": true
        },
        {
            "id": "p_001_r_001",
            "name": "mail_recipient",
            "type": "m",
            "value": "tuanma@nicegroup.com.vn",
            "owner": "recipient",
            "dataType": "String",
            "required": false
        },
        {
            "id": "p_001_r_001",
            "name": "phone_recipient",
            "type": "phone",
            "value": null,
            "owner": "recipient",
            "dataType": "String",
            "required": false
        },
        {
            "id": "p_001_r_001",
            "name": "contact_recipient",
            "type": "contactId",
            "value": null,
            "owner": "recipient",
            "dataType": "String",
            "required": false
        },
        {
            "id": "p_002",
            "name": "name_party",
            "type": "p",
            "value": "BÊN B: BÊN VAY",
            "owner": "party",
            "dataType": "String",
            "required": true
        },
        {
            "id": "p_002_r_002",
            "name": "name_recipient",
            "type": "r",
            "value": "Mr.Han",
            "owner": "recipient",
            "dataType": "String",
            "required": true
        },
        {
            "id": "p_002_r_002",
            "name": "mail_recipient",
            "type": "m",
            "value": "jhhan@nicegroup.com.vn",
            "owner": "recipient",
            "dataType": "String",
            "required": false
        },
        {
            "id": "p_002_r_002",
            "name": "phone_recipient",
            "type": "phone",
            "value": null,
            "owner": "recipient",
            "dataType": "String",
            "required": false
        },
        {
            "id": "p_002_r_002",
            "name": "contact_recipient",
            "type": "contactId",
            "value": null,
            "owner": "recipient",
            "dataType": "String",
            "required": false
        },
        {
            "id": "p_003",
            "name": "name_party",
            "type": "p",
            "value": "BÊN C: OK VAY",
            "owner": "party",
            "dataType": "String",
            "required": true
        },
        {
            "id": "p_003_r_003",
            "name": "name_recipient",
            "type": "r",
            "value": "OK Vay Tuan ky",
            "owner": "recipient",
            "dataType": "String",
            "required": true
        },
        {
            "id": "p_003_r_003",
            "name": "mail_recipient",
            "type": "m",
            "value": "tuanmait@gmail.com",
            "owner": "recipient",
            "dataType": "String",
            "required": false
        },
        {
            "id": "p_003_r_003",
            "name": "phone_recipient",
            "type": "phone",
            "value": null,
            "owner": "recipient",
            "dataType": "String",
            "required": false
        },
        {
            "id": "p_003_r_003",
            "name": "contact_recipient",
            "type": "contactId",
            "value": null,
            "owner": "recipient",
            "dataType": "String",
            "required": false
        },
        {
            "id": "0dd8f8413034a26bb50",
            "name": "fullnameA",
            "type": "ff",
            "value": "Mai Anh Tuấn",
            "owner": "requester",
            "dataType": "String",
            "required": false
        },
        {
            "id": "d6d53b64ed768c59eca",
            "name": "fullnameB",
            "type": "ff",
            "value": "Đỗ Văn Han",
            "owner": "requester",
            "dataType": "String",
            "required": false
        },
        {
            "id": "edc5c854ad5e38c7f94",
            "name": "addressC",
            "type": "ff",
            "value": "54 Liễu Giai, Ba Đình, Hà Nội",
            "owner": "requester",
            "dataType": "String",
            "required": false
        },
        {
            "id": "dueDays",
            "name": "due_in_days",
            "type": "due_days",
            "value": "30",
            "owner": "envelope",
            "dataType": "Number",
            "required": false
        }
    ]
}
const statusContract = 'https://103.112.124.129:3000/contract/FTN_CCS_RQST?fiSessionKey&fiCode=B100000011&taskCode=FTN_CCS_RQST&id=0000119yI5zgIn6JRD4DPSg2';
const bodySimpleLimit = {
    "fiSessionKey": "SPL2021020800002",
    "fiCode": "B100000011",
    "taskCode": "OKF_SPL_RQST",
    "customerNumber": "CUST0000001001",
    "name": "TEST",
    "sex": "F",
    "mobilePhoneNumber": "840961111111",
    "natId": "012345678",
    "salary": "5000000",
    "joinYearMonth": "201905",
    "infoProvConcent": "Y"
}
const urlSimpleLimit = 'https://103.112.124.129:3000/external/OKF_SPL_RQST';
        let times = 0;
        // axios.post(urlSimpleLimit, bodySimpleLimit, config).then(
        //     result => {
        //         countNextTimeCron('urlSimpleLimit');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('errSimpleLimit');
        //         return console.log(error.toString());
        // });
        //
        // axios.get(statusContract, config).then(
        //     result => {
        //         countNextTimeCron('statusContract');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('statusContract');
        //         return console.log(error.toString());
        // });
        //
        // axios.get(statusContractUrl, config).then(
        //     result => {
        //         countNextTimeCron('statusContractUrl');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('statusContractUrl');
        //     return console.log(error.toString());
        // });
        //
        //
        // axios.post(urlNFScore, bodyNfSCore, config).then(
        //     result => {
        //         countNextTimeCron('NFScore');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('NFScore');
        //     return console.log(error.toString());
        // });
        //
        // axios.post(urlCreateContract, bodyCreateContract, config).then(
        //     result => {
        //         countNextTimeCron('CreateContrac');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('CreateContrac');
        //     return console.log(error.toString());
        // });
        //
        // axios.post(urlSimpleLimit, bodySimpleLimit, config).then(
        //     result => {
        //         countNextTimeCron('SimpleLimit');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('SimpleLimit');
        //     return console.log(error.toString());
        // });
        //
        // axios.get(statusContract, config).then(
        //     result => {
        //         countNextTimeCron('statusContract');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('statusContract');
        //     return console.log(error.toString());
        // });
        //
        //
        // axios.get(statusContractUrl, config).then(
        //     result => {
        //         countNextTimeCron('ContractUrl');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('ContractUrl');
        //     return console.log(error.toString());
        // });
        //
        //
        // axios.post(urlNFScore, bodyNfSCore, config).then(
        //     result => {
        //         countNextTimeCron('NFScore');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('NFScore');
        //     return console.log(error.toString());
        // });
        //
        // axios.post(urlCreateContract, bodyCreateContract, config).then(
        //     result => {
        //         countNextTimeCron('CreateContract');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('CreateContract');
        //     return console.log(error.toString());
        // });

        let URL_FTN_GAS_RQST = 'https://103.112.124.129:3000/contract/FTN_GAS_RQST?fiCode=B100000011&taskCode=FTN_GAS_RQST&alias=Loan_Contracts_OK_VAY_20210303_Personal'
        let bodySimpleLimitPRo = {
            "mobilePhoneNumber": "0937129528",
            "infoProvConcent": "Y",
            "taskCode": "OKF_SPL_RQST",
            "ifStatus": "00",
            "fiCode": "B100000011",
            "natId": "301568618",
            "salary": "8000000",
            "ifGlobalID": "2021031808245278900201",
            "ifBusiness": "NICE",
            "ifApiUrl": "OKF_SPL_RQST",
            "ifRequestGubun": "Request"
        }

        let URL_SPLIMIT_PRO = 'https://103.112.124.129:3000/external/OKF_SPL_RQST'

        let mainscorePro = {
            "appNumber":"",
            "fiCode":"B100000011",
            "taskCode":"RCS_M01_RQST",
            "customerNumber": "",
            "productCode": "",
            "nfNiceSessionKey":"S201220210315144751318844",
            "cicNiceSessionKey":"S100320200420093489300101",
            "mobilePhoneNumber":"0964785596",
            "natId": "173300769",
            "infoProvConcent": "Y"
        }
        let NfscorePro = {
            "appNumber": "R9000000000010",
            "fiCode": "B100000011",
            "taskCode": "OKF_SCO_RQST",
            "customerNumber": "C2000000000004",
            "scoreProduct": "NOK100_001",
            "mobilePhoneNumber": "0943054509",
            "natId": "385636346",
            "infoProvConcent": "Y"
        }
        let mainScore_URL = 'https://103.112.124.129:3000/external/RCS_M01_RQST';
        let nfScore_URL = 'https://103.112.124.129:3000/external/OKF_SCO_RQST';

        let StatusEcontract = 'https://103.112.124.129:3000/contract/FTN_CCS_RQST?fiSessionKey&fiCode=B100000011&taskCode=FTN_CCS_RQST&id=0000113LIOBGhnvwMORE6H5d40';

        let CIC_MACR_RSLT = 'https://103.112.124.129:3000/external/CIC_MACR_RSLT';
        let CIC_S11A_RSLT = 'https://103.112.124.129:3000/external/CIC_S11A_RSLT';
        let CIC_S37_RSLT = 'https://103.112.124.129:3000/external/CIC_S11A_RSLT';
        let bodyCIC_MACR_RSLT = {
            "fiSessionKey" : "",
            "fiCode": "B100000011",
            "taskCode": "CIC_MACR_RSLT",
            "niceSessionKey": "S100320210318180484519926",
            "inquiryDate": ""
        }
        let bodyCIC_S37_RSLT = {
            "fiSessionKey": "",
            "niceSessionKey": "S100220210318174638019500",
            "fiCode": "B100000011",
            "taskCode": "CIC_S37_RSLT",
            "inquiryDate": "20201201",
            "infoProvConcent": "Y"
        }
        let bodyCIC_S11A_RSLT = {
            "fiSessionKey" : "",
            "fiCode": "B100000011",
            "taskCode": "CIC_S11A_RSLT",
            "niceSessionKey": "S100120210318174940819749",
            "inquiryDate": ""
        }
        axios.post(CIC_S37_RSLT, bodyCIC_S37_RSLT, config).then(
            result => {
                countNextTimeCron('CIC_S37_RSLT_: ' + result.data.responseCode);
            }
        ).catch((error) => {
            countNextTimeCron('CIC_S37_RSLT: ' + error.toString());
            return console.log(error.toString());
        });
        axios.post(CIC_S11A_RSLT, bodyCIC_S11A_RSLT, config).then(
            result => {
                countNextTimeCron('CIC_S11A_RSLT: ' + result.data.responseCode);
            }
        ).catch((error) => {
            countNextTimeCron('CIC_S11A_RSLT: ' + error.toString());
            return console.log(error.toString());
        });
        axios.post(CIC_MACR_RSLT, bodyCIC_MACR_RSLT, config).then(
            result => {
                countNextTimeCron('CIC_MACR_RSLT: ' + result.data.responseCode);
            }
        ).catch((error) => {
            countNextTimeCron('CIC_MACR_RSLT: ' + error.toString());
            return console.log(error.toString());
        });
        axios.post(URL_SPLIMIT_PRO, bodySimpleLimitPRo, config).then(
            result => {
                countNextTimeCron('bodySimpleLimit: ' + result.data.responseCode);
            }
        ).catch((error) => {
            countNextTimeCron('bodySimpleLimit: ' + error.toString());
            return console.log(error.toString());
        });

        axios.post(mainScore_URL, mainscorePro, config).then(
            result => {
                countNextTimeCron('mainscorePro: ' + result.data.responseCode);
            }
        ).catch((error) => {
            countNextTimeCron('mainscorePro: ' + error.toString());
            return console.log(error.toString());
        });
        axios.post(mainScore_URL, mainscorePro, config).then(
            result => {
                countNextTimeCron('mainscoreP: ' + result.data.responseCode);
            }
        ).catch((error) => {
            countNextTimeCron('mainscore: ' + error.toString());
            return console.log(error.toString());
        });

        axios.post(nfScore_URL, NfscorePro, config).then(
            result => {
                countNextTimeCron('Nfscore: ' + result.data.responseCode);
            }
        ).catch((error) => {
            countNextTimeCron('Nfscore: ' + error.toString());
            return console.log(error.toString());
        });
        axios.post(nfScore_URL, NfscorePro, config).then(
            result => {
                countNextTimeCron('Nfscore: ' + result.data.responseCode);
            }
        ).catch((error) => {
            countNextTimeCron('Nfscore: ' + error.toString());
            return console.log(error.toString());
        });

        axios.post(URL_SPLIMIT_PRO, bodySimpleLimitPRo, config).then(
            result => {
                countNextTimeCron('bodySimpleLimit: ' + result.data.responseCode);
            }
        ).catch((error) => {
            countNextTimeCron('bodySimpleLimit: ' + error.toString());
            return console.log(error.toString());
        });
        axios.post(URL_SPLIMIT_PRO, bodySimpleLimitPRo, config).then(
            result => {
                countNextTimeCron('bodySimpleLimit: ' + result.data.responseCode);
            }
        ).catch((error) => {
            countNextTimeCron('bodySimpleLimit: ' + error.toString());
            return console.log(error.toString());
        });

        axios.post(mainScore_URL, mainscorePro, config).then(
            result => {
                countNextTimeCron('mainscore: ' + result.data.responseCode);
            }
        ).catch((error) => {
            countNextTimeCron('mainscore: ' + error.toString());
            return console.log(error.toString());
        });

        axios.post(nfScore_URL, NfscorePro, config).then(
            result => {
                countNextTimeCron('Nfscore: ' + result.data.responseCode);
            }
        ).catch((error) => {
            countNextTimeCron('Nfscore: ' + error.toString());
            return console.log(error.toString());
        });

        // axios.get(StatusEcontract, config).then(
        //     result => {
        //         countNextTimeCron('StatusEcontract: ' + result.data.responseCode);
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('StatusEcontract: ' + error.toString());
        //     return console.log(error.toString());
        // });
        //
        // axios.get(URL_FTN_GAS_RQST, config).then(
        //     result => {
        //         countNextTimeCron('URL_FTN_GAS_RQST: ' + result.data.responseCode);
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('URL_FTN_GAS_RQST: ' + error.toString());
        //     return console.log(error.toString());
        // });


        function countNextTimeCron(any) {
            times++;
            any = 'localhost_' + any
            logger.info({time: any});
            if (times === 12) {
               oncomplete(0 , 0, times);
            }
        }
    }
}