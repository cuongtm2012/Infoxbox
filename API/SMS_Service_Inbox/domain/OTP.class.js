const config = require("../config/config");
const MOBILE_WEB_LINK = config.TemSMS.MOBILE_WEB_LINK;
class OTP {
    constructor(access_token, session_id, BrandName, Phone, Message){
        this.access_token = access_token;
        this.session_id = session_id;
        this.BrandName = BrandName;
        this.Phone = Phone;
        this.Message = Buffer.from(MOBILE_WEB_LINK + Phone).toString('base64');
    }
}


module.exports = OTP;
