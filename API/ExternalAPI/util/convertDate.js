const moment = require("moment");

module.exports = {
    timeStamp: function(){
        timeStamp = moment(new Date()).format('DD/MM/YYYY');
        return timeStamp;
    }
};