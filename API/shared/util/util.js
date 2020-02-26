module.exports = {
    checkStatusCodeScraping: function (checkedObject, msg) {
        let result = false;

        for (var i in checkedObject) {
            if (msg.split(']')[0].split('[')[1] === checkedObject[i].code) {
                result = true;
            }
        }
        return result;
    },

    getStatusScrappingCode: function (msg) {
        return msg.split(']')[0].split('[')[1];
    }
}