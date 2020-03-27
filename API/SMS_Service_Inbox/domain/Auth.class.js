class Auth {
    constructor (GRANT_TYPE, CLIENT_ID, CLIENT_SECRET, SCOPE, SESSION_ID) {
        this.GRANT_TYPE = GRANT_TYPE;
        this.CLIENT_ID = CLIENT_ID;
        this.CLIENT_SECRET = CLIENT_SECRET;
        this.SCOPE = SCOPE;
        this.SESSION_ID = SESSION_ID;
    }
}

module.exports = Auth;