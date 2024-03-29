const config = require('../config/config');
const superagent = require('superagent');
var binaryParser = require('superagent-binary-parser');
const _ = require('lodash');

function superagentGet(url, query, Authorization) {
    try {
        return new Promise((resolve, reject) => {
            let data;
            superagent
                .get(url)
                .query(query) // query string
                .set('Authorization', Authorization)
                .timeout({
                    response: 60000,  // Wait 5 seconds for the server to start sending,
                    deadline: 60000, // but allow 1 minute for the file to finish loading.
                })
                .end((err, response) => {
                    if (err)
                        return reject(err);
                    if (response.statusCode !== undefined && response.statusCode === 200) {
                        if (response.text)
                            data = response.text;
                        if (!_.isEmpty(response.body))
                            data = response.body;
                        return resolve({status: response.statusCode, data: data});
                    } else {
                        return reject(response);
                    }
                });
        });
    } catch (err) {
        console.log(err.toString());
        return err;
    }
}

function superagentPost(url, body, Authorization) {
    try {
        return new Promise((resolve, reject) => {
            let data;
            superagent
                .post(url)
                .send(body) // query string
                .set('Authorization', Authorization ? Authorization : '')
                .set('Content-Type', 'application/json')
                .timeout({
                    response: 60000,  // Wait 5 seconds for the server to start sending,
                    deadline: 60000, // but allow 1 minute for the file to finish loading.
                })
                .end((err, response) => {
                    if (err)
                        return reject(err);
                    if (response && response.statusCode !== undefined && response.statusCode === 200) {
                        if (response.text)
                            data = response.text;
                        if (!_.isEmpty(response.body))
                            data = response.body;
                        return resolve({status: response.statusCode, data: data});
                    } else {
                        return reject(response);
                    }
                });
        });
    } catch (err) {
        console.log(err.toString());
        return err;
    }
}

function superagentGetAcceptEncoding(url, query, Authorization) {
    try {
        return new Promise((resolve, reject) => {
            let data;
            superagent
                .get(url)
                .query(query) // query string
                .set('Authorization', Authorization ? Authorization : '')
                .set('Accept-Encoding', 'gzip, deflate, br')
                .timeout({
                    response: 60000,  // Wait 5 seconds for the server to start sending,
                    deadline: 60000, // but allow 1 minute for the file to finish loading.
                })
                .end((err, response) => {
                    if (err)
                        return reject(err);
                    if (response && response.statusCode !== undefined && response.statusCode === 200) {
                        if (response.text)
                            data = response.text;
                        if (!_.isEmpty(response.body))
                            data = response.body;
                        return resolve({status: response.statusCode, data: data});
                    } else {
                        return reject(response);
                    }
                });
        });
    } catch (err) {
        console.log(err.toString());
        return err;
    }
}

function superagentGetStreamType(url, query, Authorization) {
    try {
        return new Promise((resolve, reject) => {
            let data;
            superagent
                .get(url)
                .query(query) // query string
                .set('Authorization', Authorization ? Authorization : '')
                .set('responseType', 'stream')
                .timeout({
                    response: 60000,  // Wait 5 seconds for the server to start sending,
                    deadline: 60000, // but allow 1 minute for the file to finish loading.
                })
                .parse(binaryParser)
                .buffer()
                .end((err, response) => {
                    if (err)
                        return reject(err);
                    if (response && response.statusCode !== undefined && response.statusCode === 200) {
                        if (response.text)
                            data = response.text;
                        if (!_.isEmpty(response.body))
                            data = response.body;
                        return resolve({status: response.statusCode, data: data});
                    } else {
                        return reject(response);
                    }
                });
        });
    } catch (err) {
        console.log(err.toString());
        return err;
    }
}

function superagentPostZaloEncodeUrl(url, body, clientId) {
    try {
        return new Promise((resolve, reject) => {
            let data;
            superagent
                .post(url)
                .send(body) // query string
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .set('X-Client-Request-Id', clientId ? clientId : '')
                .timeout({
                    response: 60000,  // Wait 5 seconds for the server to start sending,
                    deadline: 60000, // but allow 1 minute for the file to finish loading.
                })
                .end((err, response) => {
                    if (err)
                        return reject(err);
                    if (response && response.statusCode !== undefined && response.statusCode === 200) {
                        if (response.text)
                            data = response.text;
                        if (!_.isEmpty(response.body))
                            data = response.body;
                        return resolve({status: response.statusCode, data: data});
                    } else {
                        return reject(response);
                    }
                });
        });
    } catch (err) {
        console.log(err.toString());
        return err;
    }
}

function superagentPostMultipartV01(url, authorization, requestId, type, frontImage, backImage) {
    try {
        return new Promise((resolve, reject) => {
            let data;
            superagent
                .post(url)
                .set('Content-Type', 'multipart/form-data')
                .set('Authorization', authorization)
                .accept('application/json')
                .field('requestId', requestId)
                .field('type', type)
                .field('frontImage', frontImage)
                .field('backImage', backImage ? backImage : '')
                .timeout({
                    response: 100000,  // Wait 5 seconds for the server to start sending,
                    deadline: 100000, // but allow 1 minute for the file to finish loading.
                })
                .end((err, response) => {
                    if (err)
                        return reject(err);
                    if (response && response.statusCode !== undefined && response.statusCode === 200) {
                        if (response.text)
                            data = response.text;
                        if (!_.isEmpty(response.body))
                            data = response.body;
                        return resolve({status: response.statusCode, data: data});
                    } else {
                        return reject(response);
                    }
                });
        });
    } catch (err) {
        console.log(err.toString());
        return err;
    }
}

function superagentPostMultipartV02(url, authorization, requestId, targetImage, sourceImage) {
    try {
        return new Promise((resolve, reject) => {
            let data;
            superagent
                .post(url)
                .set('Content-Type', 'multipart/form-data')
                .set('Authorization', authorization)
                .accept('application/json')
                .field('requestId', requestId)
                .field('targetImage', targetImage)
                .field('sourceImage', sourceImage)
                .timeout({
                    response: 100000,  // Wait 5 seconds for the server to start sending,
                    deadline: 100000, // but allow 1 minute for the file to finish loading.
                })
                .end((err, response) => {
                    if (err)
                        return reject(err);
                    if (response && response.statusCode !== undefined && response.statusCode === 200) {
                        if (response.text)
                            data = response.text;
                        if (!_.isEmpty(response.body))
                            data = response.body;
                        return resolve({status: response.statusCode, data: data});
                    } else {
                        return reject(response);
                    }
                });
        });
    } catch (err) {
        console.log(err.toString());
        return err;
    }
}

function superagentPostS37(url, body, Authorization) {
    try {
        return new Promise((resolve, reject) => {
            let data;
            superagent
                .post(url)
                .send(body) // query string
                .set('Authorization', Authorization ? Authorization : '')
                .set('Content-Type', 'application/json')
                .timeout({
                    response: 120000,  // Wait 5 seconds for the server to start sending,
                    deadline: 120000, // but allow 1 minute for the file to finish loading.
                })
                .end((err, response) => {
                    if (err)
                        return reject(err);
                    if (response && response.statusCode !== undefined && response.statusCode === 200) {
                        if (response.text)
                            data = response.text;
                        if (!_.isEmpty(response.body))
                            data = response.body;
                        return resolve({status: response.statusCode, data: data});
                    } else {
                        return reject(response);
                    }
                });
        });
    } catch (err) {
        console.log(err.toString());
        return err;
    }
}
module.exports.superagentPost = superagentPost;
module.exports.superagentGet = superagentGet;
module.exports.superagentGetAcceptEncoding = superagentGetAcceptEncoding;
module.exports.superagentGetStreamType = superagentGetStreamType;
module.exports.superagentPostZaloEncodeUrl = superagentPostZaloEncodeUrl;
module.exports.superagentPostMultipartV01 = superagentPostMultipartV01;
module.exports.superagentPostMultipartV02 = superagentPostMultipartV02;
module.exports.superagentPostS37 = superagentPostS37;