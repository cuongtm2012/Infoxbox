var redis = require('redis');
var config = require('../config/config');

var redisClient = redis.createClient({host : config.redis.host, port : config.redis.port});
module.exports = redisClient;