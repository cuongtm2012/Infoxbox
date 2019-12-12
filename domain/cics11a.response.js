var userModel1 = require('./userModel1');

module.exports = function cics11aModelRes(u, u1) {
    const {CUS_NM, CUS_AGE} = u;
    console.log("u::", u)
    this.CUST_GB_S22222 = CUS_NM;
    this.CUST_CD_S = CUS_AGE;
    this.user1 = new userModel1(u1);
};
