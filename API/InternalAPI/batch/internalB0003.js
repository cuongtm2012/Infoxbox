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
                // return next();
                oncomplete(0, 0)
            }
            data.forEach(element => {
                // let fnData = data[i].child;
                console.log("element::::", element);

                //Updatinh Scraping target report does not exist
                cicService.updateScrapingTargetRepostNotExist(element).then(result => {
                    // return next();
                    count++;
                    oncomplete(count, maxLength)
                });

            });
        }).catch((error) => {
            console.log(error)
        });;
    }
}