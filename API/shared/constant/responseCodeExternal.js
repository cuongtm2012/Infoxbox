
var RESCODEEXT = {
    NORMAL: { value: 0, name: "Normal", code: "P000" },
    INPROCESS: { value: 100, name: "In process", code: "0000" },
    NIFICODE: { value: 1, name: "Need to input mandatory item(FI code)", code: "F001" },
    NICICCODE: { value: 2, name: "Need to input mandatory item(CIC product  code)", code: "F002" },
    IVFICODE: { value: 3, name: "Invalid FI code", code: "F003" },
    IVCICCODE: { value: 4, name: "Invalid CIC product code", code: "F004" },
    NILOGINID: { value: 5, name: "Need to input mandatory item(log in ID)", code: "F005" },
    NIPASSWORD: { value: 6, name: "Need to input mandatory item(log in Password)", code: "F006" },
    NITASKCODE: { value: 18, name: "Need to input mandatory item(Task code)", code: "F018" },
    NINICESESSIONKEY: { value: 19, name: "Need to input mandatory item(NICE session key)", code: "F019" },
    NINAME: {value: 26, name: "Need to input mandatory item(Name)", code: "F026" },
    NIMOBILEPHONENUMBER: {value: 27, name: "Need to input mandatory item(Mobile phone number)", code: "F027"},
    UNKNOW: { value: 400, name: "UNKNOW", code: "400" },
    NOTEXIST: { value: 405, name: "DON'T HAVE RESULT FOR THIS NICE SESSION KEY", code: "405" }
};

module.exports.RESCODEEXT = RESCODEEXT;