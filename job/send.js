module.exports = class sendDb {

    cron(db, onComplete) {
        this.getCICRequest(db, (err) => {
            onComplete(0, 0)
        },
        (result) => {
            // TO DO select data base to send request to CIC
        });
    }

    getCICRequest(db, onError, onSuccess) {
        // TO DO get request to send to CIC service
    }

}