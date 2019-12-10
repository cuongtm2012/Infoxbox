var userModel1 = require('./userModel1');

module.exports = function cics11aModelRes(u, u1) {
    const {cusName, cusAge} = u;
    console.log("u::", u)
    this.CUST_GB_S22222 = cusName;
    this.CUST_CD_S = cusAge;
    this.user1 = new userModel1(u1);
};
