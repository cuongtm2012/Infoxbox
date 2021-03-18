const cicService = require('../services/cicInternal.service');
const URI = require('../../shared/URI');
const defaultParams = require('../../shared/domain/defaultParams.request');
const _ = require('lodash');
const convertBase64 = require('../../shared/util/convertBase64ToText');

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
const downloadContractUrl = 'https://localhost:3100/contract/FTN_GCT_RQST?fiCode=B100000011&taskCode=FTN_GCT_RQST&id=000011JlI9Gai43vy912RfWz';
const statusContractUrl = 'https://localhost:3100/contract/FTN_GAS_RQST?fiCode=B100000011&taskCode=FTN_GAS_RQST&alias=hop_dong_nice_test_0112';
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
const urlNFScore = 'https://localhost:3100/external/OKF_SCO_RQST'

const urlCreateContract = 'https://localhost:3100/contract/FTN_SCD_RQST';
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
const statusContract = 'https://localhost:3100/contract/FTN_CCS_RQST?fiSessionKey&fiCode=B100000011&taskCode=FTN_CCS_RQST&id=0000119yI5zgIn6JRD4DPSg2';
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
const urlSimpleLimit = 'https://localhost:3100/external/OKF_SPL_RQST';
        let times = 0;
        axios.post(urlSimpleLimit, bodySimpleLimit, config).then(
            result => {
                countNextTimeCron('urlSimpleLimit');
            }
        ).catch((error) => {
            countNextTimeCron('errSimpleLimit');
                return console.log(error.toString());
        });

        axios.get(statusContract, config).then(
            result => {
                countNextTimeCron('statusContract');
            }
        ).catch((error) => {
            countNextTimeCron('statusContract');
                return console.log(error.toString());
        });

        axios.get(statusContractUrl, config).then(
            result => {
                countNextTimeCron('statusContractUrl');
            }
        ).catch((error) => {
            countNextTimeCron('statusContractUrl');
            return console.log(error.toString());
        });


        axios.post(urlNFScore, bodyNfSCore, config).then(
            result => {
                countNextTimeCron('NFScore');
            }
        ).catch((error) => {
            countNextTimeCron('NFScore');
            return console.log(error.toString());
        });

        axios.post(urlCreateContract, bodyCreateContract, config).then(
            result => {
                countNextTimeCron('CreateContrac');
            }
        ).catch((error) => {
            countNextTimeCron('CreateContrac');
            return console.log(error.toString());
        });

        axios.post(urlSimpleLimit, bodySimpleLimit, config).then(
            result => {
                countNextTimeCron('SimpleLimit');
            }
        ).catch((error) => {
            countNextTimeCron('SimpleLimit');
            return console.log(error.toString());
        });

        axios.get(statusContract, config).then(
            result => {
                countNextTimeCron('statusContract');
            }
        ).catch((error) => {
            countNextTimeCron('statusContract');
            return console.log(error.toString());
        });


        axios.get(statusContractUrl, config).then(
            result => {
                countNextTimeCron('ContractUrl');
            }
        ).catch((error) => {
            countNextTimeCron('ContractUrl');
            return console.log(error.toString());
        });


        axios.post(urlNFScore, bodyNfSCore, config).then(
            result => {
                countNextTimeCron('NFScore');
            }
        ).catch((error) => {
            countNextTimeCron('NFScore');
            return console.log(error.toString());
        });

        axios.post(urlCreateContract, bodyCreateContract, config).then(
            result => {
                countNextTimeCron('CreateContract');
            }
        ).catch((error) => {
            countNextTimeCron('CreateContract');
            return console.log(error.toString());
        });

        // axios.get(downloadContractUrl, config).then(
        //     result => {
        //         countNextTimeCron('downloadContractUrl');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('downloadContractUrl');
        //     return console.log(error.toString());
        // });

        // axios.get(downloadContractUrl, config).then(
        //     result => {
        //         countNextTimeCron('downloadContractUrl');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('downloadContractUrl');
        //     return console.log(error.toString());
        // });
        // axios.get(downloadContractUrl, config).then(
        //     result => {
        //         countNextTimeCron('downloadContractUrl');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('downloadContractUrl');
        //     return console.log(error.toString());
        // });
        // axios.get(downloadContractUrl, config).then(
        //     result => {
        //         countNextTimeCron('downloadContractUrl');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('downloadContractUrl');
        //     return console.log(error.toString());
        // });
        // axios.get(downloadContractUrl, config).then(
        //     result => {
        //         countNextTimeCron('downloadContractUrl');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('downloadContractUrl');
        //     return console.log(error.toString());
        // });
        // axios.get(downloadContractUrl, config).then(
        //     result => {
        //         countNextTimeCron('downloadContractUrl');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('downloadContractUrl');
        //     return console.log(error.toString());
        // });
        // axios.get(downloadContractUrl, config).then(
        //     result => {
        //         countNextTimeCron('downloadContractUrl');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('downloadContractUrl');
        //     return console.log(error.toString());
        // });
        // axios.get(downloadContractUrl, config).then(
        //     result => {
        //         countNextTimeCron('downloadContractUrl');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('downloadContractUrl');
        //     return console.log(error.toString());
        // });
        // axios.get(downloadContractUrl, config).then(
        //     result => {
        //         countNextTimeCron('downloadContractUrl');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('downloadContractUrl');
        //     return console.log(error.toString());
        // });
        // axios.get(downloadContractUrl, config).then(
        //     result => {
        //         countNextTimeCron('downloadContractUrl');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('downloadContractUrl');
        //     return console.log(error.toString());
        // });
        // axios.get(downloadContractUrl, config).then(
        //     result => {
        //         countNextTimeCron('downloadContractUrl');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('downloadContractUrl');
        //     return console.log(error.toString());
        // });
        // axios.get(downloadContractUrl, config).then(
        //     result => {
        //         countNextTimeCron('downloadContractUrl');
        //     }
        // ).catch((error) => {
        //     countNextTimeCron('downloadContractUrl');
        //     return console.log(error.toString());
        // });
        function countNextTimeCron(any) {
            times++;
            console.log(times , ' : ',  any);
            if (times === 11) {
                console.log(times);
               oncomplete(0 , 0);
            }
        }
    }
}