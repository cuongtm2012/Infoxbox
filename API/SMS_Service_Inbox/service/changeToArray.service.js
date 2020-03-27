valueChange = function(row){
    let phone = [];
    phone.push(row.MSGKEY, row.COMPKEY, row.PHONE, row.STATUS_SMS, 
        row.INPUT_DATE, row.SEND_DATE, row.RSLT_DATE, row.RSLT, row.MSG, row.TYPE_SMS);
        return phone;
}

module.exports = valueChange;
