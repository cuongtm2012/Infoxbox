const util = require('./dateutil');

module.exports = {
    makeNiceSessionKey: function (cicGoodCode) {
        //Total 25 Length: “IB”(2) + NICE Product Code(5) + YYYYMMDDhhmmsss (15) + random(3)
        return util.timeStamp2() + generate(5);
    },

    niceProductCode: function (cicGoodCode) {
        var productCode;

        switch (cicGoodCode) {
            case "06":
                productCode = "S1001";
                break;

            default:
                productCode = "S1001";
        }

        return productCode;
    }
};

function generate(n) {
    var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   

    if (n > max) {
        return generate(max) + generate(n - max);
    }

    max = Math.pow(10, n + add);
    var min = max / 10; // Math.pow(10, n) basically
    var number = Math.floor(Math.random() * (max - min + 1)) + min;

    return ("" + number).substring(add);
}
