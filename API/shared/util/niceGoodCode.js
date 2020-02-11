module.exports = {
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
}