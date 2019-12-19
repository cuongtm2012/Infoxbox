module.exports = {
    defaultParams: function(inqDt1, inqDt2, step_input, step_data) {
        let data = {
            appCd: 'infotechDev',
            orgCd: 'cic.vn',
            svcCd: 'B0002',
            dispNm: 'cic.org.vn',
            customerType: '2',
            reportType: '06',
            voteNo: '1',
            reqStatus: '1',
            inqDt1: inqDt1  ? inqDt1 : "",
            inqDt2: inqDt2 ? inqDt2 : "",
            step_input: step_input ? step_input : "",
            step_data: step_data ? step_data : ""
        }

        return data;
    }
};
