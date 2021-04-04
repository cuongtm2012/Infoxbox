module.exports = function user_response(user) {
    const {
        USER_ID,
        USER_NM,
        EMAIL,
        CUST_CD,
        INOUT_GB,
        VALID_START_DT,
        VALID_END_DT,
        TEL_NO_MOBILE,
        ADDR,
        SYS_DTIM,
        WORK_ID,
        ACTIVE,
        ROLE_ID

    } = user;

    this.USER_NM = USER_NM;
    this.EMAIL = EMAIL;
    this.USER_ID = USER_ID;
    this.ROLE_ID = ROLE_ID;
    this.CUST_CD = CUST_CD;
    this.INOUT_GB = INOUT_GB;
    this.VALID_START_DT = VALID_START_DT;
    this.VALID_END_DT = VALID_END_DT;
    this.TEL_NO_MOBILE = TEL_NO_MOBILE;
    this.ADDR = ADDR;
    this.SYS_DTIM = SYS_DTIM;
    this.WORK_ID = WORK_ID;
    this.ACTIVE = ACTIVE;
};
