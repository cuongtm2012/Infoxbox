
var RESCODEEXT = {
    NORMAL: { value: 0, name: "Normal", code: "P000" },
    INPROCESS: { value: 100, name: "In process", code: "0000" },
    NIFICODE: { value: 1, name: "Need to input mandatory item(FI code)", code: "F001" },
    NICICCODE: { value: 2, name: "Need to input mandatory item(CIC product  code)", code: "F002" },
    IVFICODE: { value: 3, name: "Invalid FI code", code: "F003" },
    IVCICCODE: { value: 4, name: "Invalid CIC product code", code: "F004" },
    INLOGINID: { value: 5, name: "Need to input mandatory item(log in ID)", code: "F005" },
    NIPASSWORD: { value: 6, name: "Need to input mandatory item(log in Password)", code: "F006" },
    UNKNOW: { value: 400, name: "UNKNOW", code: "400" }
};

module.exports.RESCODEEXT = RESCODEEXT;