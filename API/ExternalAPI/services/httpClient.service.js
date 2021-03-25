const https = require('https');
const http = require('http');
const config = require('../config/config');
const qs = require('qs');
function HTTPS_PostJson(host, path, port, body) {
    return new Promise((resolve, reject) => {
        try {
            const httpsBody = JSON.stringify(body);
            const optionHttpsPost = {
                hostname: host,
                port: port,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': httpsBody.length
                },
                timeout: config.requestTimeOut.applicationJson
            }
            const request = https.request(optionHttpsPost, response => {
                let result = '';
                response.on('data', data => {
                    result += data;
                    resolve(JSON.parse(result));
                })
                response.on('error', err => {
                    console.log(err);
                    reject(err);
                });
            })
            request.on('error', error => {
                console.error(error);
                reject(error);
            })
            request.write(httpsBody)
            request.end()
        } catch (err) {
            console.log(err.toString());
            reject(err)
        }
    });
}


function HTTP_PostJson(host, path, port, body) {
    return new Promise((resolve, reject) => {
        try {
            const httpBody = JSON.stringify(body);
            const optionHttpPost = {
                hostname: host,
                port: port,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(httpBody)
                },
                timeout: config.requestTimeOut.applicationJson
            }
            const request = http.request(optionHttpPost, response => {
                let result = '';
                response.on("data", data => {
                    result += data;
                    resolve(JSON.parse(result));
                })
                response.on("error", err => {
                    console.log(err);
                    reject(err);
                })
            })
            request.on("error", err => {
                console.log(err);
                reject(err);
            })
            request.end(httpBody)
        } catch (err) {
            console.log(err.toString());
            reject(err);
        }
    });
}

function HTTPS_PostUrlEncoded(host, path, port, body, extendHeader) {
    return new Promise((resolve, reject) => {
        try {
            const httpsBody = qs.stringify(body);
            const optionHttpsPost = {
                hostname: host,
                port: port,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(httpsBody),
                    'X-Client-Request-Id': extendHeader ? extendHeader : ''
                },
                timeout: config.requestTimeOut.applicationJson
            }
            const request = https.request(optionHttpsPost, response => {
                let result = '';
                console.log(extendHeader ? 'X-Client-Request-Id: ' + extendHeader : '');
                response.on('data', data => {
                    result += data;
                    resolve(JSON.parse(result));
                })
                response.on('error', err => {
                    console.log(err);
                    reject(err);
                });
            })
            request.on('error', error => {
                console.error(error);
                reject(error);
            })
            request.write(httpsBody)
            request.end()
        } catch (err) {
            console.log(err.toString());
            reject(err)
        }
    });
}

module.exports.HTTP_PostJson = HTTP_PostJson;
module.exports.HTTPS_PostJson = HTTPS_PostJson;
module.exports.HTTPS_PostUrlEncoded = HTTPS_PostUrlEncoded;