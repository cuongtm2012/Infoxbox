const dateUtil = require('./service/date.service');
var moment = require('moment-timezone');
let timeOutput = moment().tz("Asia/Bangkok").format();
console.log(dateUtil.formatDate(timeOutput));
console.log(timeOutput[0]+timeOutput[1]+timeOutput[2]+timeOutput[3]);