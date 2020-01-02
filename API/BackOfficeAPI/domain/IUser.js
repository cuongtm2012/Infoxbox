const IUser = require('./user.response');

module.exports = function user_response(user, session) {
    this.user = new IUser(user);
    this.session = session ? session : "";
}