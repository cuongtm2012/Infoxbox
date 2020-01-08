var redisClient = require('./redisClient');

exports.PINCODE_PREFIX = '_pincode';

exports.get = function(key, onResult) {
    redisClient.get(key, function (err, reply) {
		onResult(err, reply);
	});
}

exports.set = function(key, value, onResult) {
    redisClient.set(key, value, function (err, reply) {
		onResult(err, reply);
	});
}