module.exports = {
    defaultParams: function (inqDt1, inqDt2, step_input, step_data) {
        let data = {
            appCd: 'INFOBOX',
            iftUrl: 'http://www.infotech3.co.kr/ift/deploy/',
            dispNm: 'cic.org.vn',
            customerType: '2',
            reportType: '06',
            voteNo: '111',
            reqStatus: '1',
            inqDt1: inqDt1 ? inqDt1 : "",
            inqDt2: inqDt2 ? inqDt2 : "",
            step_input: step_input ? step_input : "",
            step_data: step_data ? step_data : "",
            userId: "h01663001phu",
            userPw: "RILO2018"
        }

        return data;
    }
};
