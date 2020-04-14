module.exports = function user_response(user) {
    const {
        USER_ID,
        USER_NM,
        EMAIL

    } = user;

    this.username = USER_NM;
    this.email = EMAIL;
    this.userid = USER_ID;
}
