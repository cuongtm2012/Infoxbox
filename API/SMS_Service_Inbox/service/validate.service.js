const DataController = require('../controller/DataController');
const logger = require('../config/logger');

exports.isPhoneNumber = function(datas){
    return new Promise(async function(resolve, reject){
        console.log(new Date());
        console.log("============ check if the phone number is valid =================")
        let pattern = /^0[35789]{1}[0-9]{7}[0-9]{1}$/;
        let reg = new RegExp(pattern);
        let phonesList = [];
        for(const data of datas) {
            if(reg.test(data.TEL_NO_MOBILE)) {
                phonesList.push(data.TEL_NO_MOBILE);
            } else {
                logger.error(data.TEL_NO_MOBILE);
            }
        }
        resolve(phonesList);
    })
};

