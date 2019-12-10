
// const options = {
//     hostname: 'whatever.com',
//     port: 443,
//     path: '/todos',
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Content-Length': data.length
//     }
// }

// exports.options = options;


module.exports = function options({ hostname, port, path, method }, data) {
    this.hostname = hostname;
    this.port = port;
    this.path = path;
    this.method = method;
    this.headers = {'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data, 'utf8')};
};
