const DataController = require('../controller/DataController');
const logger = require('../config/logger');

exports.isPhoneNumber = function(phones){
    return new Promise(async function(resolve, reject){
        console.log(new Date());
        console.log("============ check if the phone number is valid =================")
        let pattern = /^0[35789]{1}[0-9]{7}[0-9]{1}$/;
        let reg = new RegExp(pattern);
        let phonesList = [];
        for(const phone of phones) {
            if(reg.test(phone.PHONE)) {
                phonesList.push(phone);
            } else {
                logger.error(phone.PHONE);
            }
        }
        resolve(phonesList);
    })
};

