module.exports = function user_response(user) {
    const {
        USER_ID,
        USER_NAME,
        FULL_NAME,
        EMAIL

    } = user;

    this.username = USER_NAME;
    this.fullname = FULL_NAME;
    this.email = EMAIL;
    this.userid = USER_ID;
}