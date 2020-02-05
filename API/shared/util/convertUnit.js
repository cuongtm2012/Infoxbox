module.exports = {
    milionUnit: function (params) {
        if (params !== null && params !== undefined && 0 !== params.length)
            return Math.round(parseFloat(params) * 1000000);
        else
            return params;
    },
    convertNumber: function (params) {
        if (params !== null && params !== undefined && 0 !== params.length)
            return parseInt(params);
        else
            return params;
    }
}