const cicService = require('../services/cicInternal.service');
const validation = require('../../shared/util/validation');

module.exports = class internalJob {
    //Cron request internal scraping
    cron(oncomplete) {

        cicService.select04NotExist().then(data => {

            var count = 0;
            var maxLength = data.length;
            console.log("maxLength2~~~", maxLength);

            // Get each object in array data
            if (validation.isEmptyJson(data)) {
                console.log('No request!');
                oncomplete(0, 0)
            }
            data.forEach(element => {
                console.log("element::::", element);

                // update SCRP_MOD_CD = 01 before
                cicService.updateScrpModCdPreRequestToScrapingB0002(element.NICE_SSIN_ID).then(() => {
                    //Updatinh Scraping target report does not exist
                    cicService.updateScrapingTargetRepostNotExist(element.NICE_SSIN_ID).then(() => {
                        count++;
                        oncomplete(count, maxLength)
                    });
                })
            });
        }).catch((error) => {
            console.log(error)
        });
    }
}