const MOBILE_WEB_LINK = ' https://103.112.124.153:4201/banks?phone=';
// const MOBILE_WEB_LINK = ' https://103.112.124.129:4201/banks?phone=';

class OTP {
    constructor(access_token, session_id, BrandName, Phone, Message){
        this.access_token = access_token;
        this.session_id = session_id;
        this.BrandName = BrandName;
        this.Phone = Phone;
        this.Message = Buffer.from(Message + MOBILE_WEB_LINK + Phone).toString('base64');
    }
}

module.exports = OTP;
