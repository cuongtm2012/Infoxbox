const IUser = require('./user.response');

module.exports = function user_response(user, auth, token , role) {
    this.user = new IUser(user);
    this.auth = auth ? auth : "";
    this.token = token ? token : "";
    this.role = role;
}
