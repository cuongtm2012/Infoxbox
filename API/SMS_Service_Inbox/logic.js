const DataController = require('./controller/DataController');
const validatePhone = require('./service/validate.service');
const CampaignController = require('./controller/CampaignController');
const OtpController = require('./controller/OtpController');
const dateService = require('./service/date.service');
const otpDomain = require('./domain/OTP.class');
const campaignDomain = require('./domain/Campaign.class');
const BrandNameAds = require('./domain/BrandNameAds.class');
const logger = require('./config/logger');
const config = require('./config/config');

otpFunction = async function () {
    return new Promise(async function (resolve, reject) {
        // console.log(new Date);
        try {
            // await checkTableExist();
            const getData = await DataController.getPhoneNumber();
            if (getData.length > 0) {
                await DataController.updateTryCountAfterGetPhoneNumber(getData[0].NICE_SSIN_ID, getData[0].TRY_COUNT);
                const getValidPhone = await validatePhone.isPhoneNumber(getData);
                for (const phone of getValidPhone) {
                    // if (phone.TYPE_SMS === 0) {
                    await updateAfterSend(getData[0]);
                    // } else {
                    //     await updateAfterSendCampaign(phone);
                    // }
                }
            }
            resolve(true);
        } catch (e) {
            logger.error(e);
        }

    });
};

// let updateAfterSendCampaign = async function (phone) {
//     try {
//         const sendSMSCamp = await sendCampaign(phone);
//         console.log(sendSMSCamp);
//         if (sendSMSCamp) {
//             await moveData(0, 1, phone)
//         } else {
//             await moveData(1, 1, phone)
//         }
//     } catch (err) {
//         logger.error(err);
//     }
// };

let updateAfterSend = async function (data) {
    try {
        const result = await sendOTP(data);
        console.log(result);
        if (result) {
            console.log("updating when send sms success");
            await DataController.updateSCRP_MOD_CD(data.TEL_NO_MOBILE, data.NICE_SSIN_ID);
        } else {
            //If SRCAP_MOD_CD != 05 && TRY_COUNT == 3 => Fail to send Sms!
            if (data.SCRP_MOD_CD !== '05' && data.TRY_COUNT < 3) {
                console.log("updating when send sms fail < 3 time");
                await DataController.updateSCRP_MOD_CDWhenFailSendSMS(data.TEL_NO_MOBILE, data.NICE_SSIN_ID);
            } else {
                console.log("updating when send sms failed and over 3 time sent");
                await DataController.updateSCRP_MOD_CD(data.TEL_NO_MOBILE, data.NICE_SSIN_ID);
            }
        }
    } catch (err) {
        logger.error(err);
    } finally {
        console.log('finish send process');
    }
};

// let moveData = async function (rslt, status, phone) {
//     try {
//         console.log('===================== update this phone ============================');
//         // console.log('=======================get this phone===================');
//         // const resultSelect = await DataController.getRow(phone);
//         // console.log('=================== insert =========================');
//         // const resultInsert = await DataController.insertMSG(resultSelect[0]);
//         // console.log("---------------------------delete-------------------------------");
//         // const resultDelete = await DataController.deleteMSG(phone);
//         // console.log(resultDelete);
//     } catch (err) {
//         logger.error(err);
//     }
// };

let sendOTP = async function (data) {
    try {
        console.log("========================= get auth for sending otp ==================");
        const getAuth = await OtpController.getAuth();
        if (getAuth) {
            let otp = new otpDomain(getAuth.access_token, 'abcd', config.BRAND_NAME_TEST, data.TEL_NO_MOBILE, data);
            console.log(otp);
            const sendSMS = await OtpController.sendBrandNameOTP(otp);
            return sendSMS;
        } else {
            console.log('get getAuth error!', getAuth);
            return false;
        }
    } catch (err) {
        logger.error(err);
    }
};

// let checkTableExist = async function () {
//     try {
//         const tableCheck = await DataController.selectTable();
//         console.log(tableCheck);
//         if (tableCheck.length < 1) {
//             const tableCreate = await DataController.createTable();
//             console.log(tableCreate);
//         } else {
//             console.log('nothing to do');
//         }
//     } catch (e) {
//         logger.error(e);
//     }
// };

// let sendCampaign = async function (phone) {
//     try {
//         console.log("========================= get auth for campaign ==================");
//         const getAuth = await CampaignController.getAuth();
//         const dateCampaign = dateService.formatDateForCampaign(phone.SEND_DATE);
//         let campaign = new campaignDomain(getAuth.access_token, 'abcd', 'Khuyen 27' + new Date, 'FTI', phone.MSG, dateCampaign, '20');
//
//         console.log("========================= create campaign ==================");
//         const createCampaign = await CampaignController.createCampaign(campaign, getAuth.access_token);
//
//         console.log("========================= send campaign ==================");
//         let brandName = new BrandNameAds(getAuth.access_token, 'abcde', createCampaign.CampaignCode, phone.PHONE);
//         const sendCampaign = await CampaignController.sendSMS(brandName);
//         console.log(sendCampaign);
//         return sendCampaign;
//     } catch (e) {
//         logger.error(e);
//     }
// };

module.exports = otpFunction;
