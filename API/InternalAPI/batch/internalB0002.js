const cicService = require('../services/cicInternal.service');
const validation = require('../../shared/util/validation');
const decrypt = require('../util/encryptPassword');
const URI = require('../../shared/URI');
const dateutil = require('../util/dateutil');
const defaultParams = require('../domain/defaultParams.request');

const cicB0002Req = require('../domain/cicB0002.request');

const axios = require('axios');

module.exports = class internalJob {
    //Cron request internal scraping
    cron(oncomplete) {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        cicService.select01().then(data => {
            // Get each object in array data
            if (validation.isEmptyJson(data)) {
                console.log('No request!');
                // return next();
                oncomplete(0, 0)
                // return;
            }

            var count = 0;
            var maxLength = data.length;
            console.log("maxLength11~~~", maxLength);

            data.forEach(element => {
                // let fnData = data[i].child;
                console.log("element::::", element);
                let inqDt1 = dateutil.getDate();
                let inqDt2 = dateutil.getDate();

                let defaultValue = defaultParams.defaultParams(inqDt1, inqDt2, '', '');

                //Convert data to format cic site
                //decrypt password
                var decryptPW = decrypt.decrypt(element.LOGIN_PW);
                var fnData = new cicB0002Req(element, defaultValue, decryptPW);

                cicService.updateScrpModCdPreRequestToScraping(element).then(() => {
                    // "?inJsonList=%5B" + querystrings + "%5D"
                    axios.post(URI.internal_cic, fnData, config)
                        .then((body) => {
                            console.log("body result222~~~~~", body.data);

                            count++;
                            // next process until data ending
                            oncomplete(count, maxLength);
                            // return res.status(200).json(body.data);

                        }).catch((error) => {
                            console.log("error call to internal_cic url~~",error);
                            return;
                        });
                });
            });
        }).catch((error) => {
            console.log(error)
        });
    }
}