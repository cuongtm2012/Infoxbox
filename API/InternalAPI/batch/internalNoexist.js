const cicService = require('../services/cicInternal.service');
const _ = require('lodash');

module.exports = class internalJob {
    //Cron request internal scraping
    cron(oncomplete) {

        cicService.select04NotExist().then(data => {
            const listNiceSessinKey = [];

            // Get each object in array data
            if (_.isEmpty(data)) {
                console.log('No request!');
                oncomplete(0, 0);
            }
            else {
                // Get list nice session key
                _.forEach(data, res => {
                    listNiceSessinKey.push(res.NICE_SSIN_ID);
                });

                cicService.updateScrpModCdPreRequestToScraping(listNiceSessinKey).then(() => {
                    //Updatinh Scraping target report does not exist
                    cicService.updateScrapingTargetRepostNotExist(listNiceSessinKey).then(() => {
                        oncomplete(0, 0);
                    });
                })
            }
        }).catch((error) => {
            console.log(error)
        });
    }
}