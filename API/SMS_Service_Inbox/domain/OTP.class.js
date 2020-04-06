const config = require("../config/config");
class OTP {
    constructor(access_token, session_id, BrandName, Phone, Message){
        this.access_token = access_token;
        this.session_id = session_id;
        this.BrandName = BrandName;
        this.Phone = Phone;
        this.Message = Buffer.from(config.FinalSMS_1 +
                                    config.TemSMS.APPLE_LINK +
                                    config.FinalSMS_2 +
                                    config.TemSMS.ANDROID_LINK +
                                    config.FinalSMS_3 +
                                    config.TemSMS.MOBILE_LINK + Phone +
                                    config.FinalSMS_4).toString('base64');
    }
}


module.exports = OTP;
