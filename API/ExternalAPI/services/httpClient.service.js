const config = require('../config/config');
const superagent = require('superagent');
var binaryParser = require('superagent-binary-parser');
const _ = require('lodash');

function superagentGet(url, query, Authorization) {
    return new Promise((resolve, reject) => {
        try {
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
                        reject(err);
                    if (response.statusCode !== undefined && response.statusCode === 200) {
                        if (response.text)
                            data = response.text;
                        if (!_.isEmpty(response.body))
                            data = response.body;
                        resolve({status: response.statusCode, data: data});
                    } else {
                        reject(response);
                    }
                });
        } catch (err) {
            reject(err)
        }
    })
}

function superagentPost(url, body, Authorization) {
    return new Promise((resolve, reject) => {
        try {
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
                        reject(err);
                    if (response.statusCode !== undefined && response.statusCode === 200) {
                        if (response.text)
                            data = response.text;
                        if (!_.isEmpty(response.body))
                            data = response.body;
                        resolve({status: response.statusCode, data: data});
                    } else {
                        reject(response);
                    }
                });
        } catch (err) {
            reject(err)
        }
    })
}

function superagentGetAcceptEncoding(url, query, Authorization) {
    return new Promise((resolve, reject) => {
        try {
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
                        reject(err);
                    if (response.statusCode !== undefined && response.statusCode === 200) {
                        if (response.text)
                            data = response.text;
                        if (!_.isEmpty(response.body))
                            data = response.body;
                        resolve({status: response.statusCode, data: data});
                    } else {
                        reject(response);
                    }
                });
        } catch (err) {
            reject(err)
        }
    })
}

function superagentGetStreamType(url, query, Authorization) {
    return new Promise((resolve, reject) => {
        try {
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
                        reject(err);
                    if (response.statusCode !== undefined && response.statusCode === 200) {
                        if (response.text)
                            data = response.text;
                        if (!_.isEmpty(response.body))
                            data = response.body;
                        resolve({status: response.statusCode, data: data});
                    } else {
                        reject(response);
                    }
                });
        } catch (err) {
            reject(err)
        }
    })
}

function superagentPostZaloEncodeUrl(url, body, clientId) {
    return new Promise((resolve, reject) => {
        try {
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
                        reject(err);
                    if (response.statusCode !== undefined && response.statusCode === 200) {
                        if (response.text)
                            data = response.text;
                        if (!_.isEmpty(response.body))
                            data = response.body;
                        resolve({status: response.statusCode, data: data});
                    } else {
                        reject(response);
                    }
                });
        } catch (err) {
            reject(err)
        }
    })
}

function superagentPostMultipartV01(url, authorization, requestId, type, frontImage, backImage) {
    return new Promise((resolve, reject) => {
        try {
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
                        reject(err);
                    if (response.statusCode !== undefined && response.statusCode === 200) {
                        if (response.text)
                            data = response.text;
                        if (!_.isEmpty(response.body))
                            data = response.body;
                        resolve({status: response.statusCode, data: data});
                    } else {
                        reject(response);
                    }
                });
        } catch (err) {
            reject(err)
        }
    })
}

function superagentPostMultipartV02(url, authorization, requestId, targetImage, sourceImage) {
    return new Promise((resolve, reject) => {
        try {
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
                        reject(err);
                    if (response.statusCode !== undefined && response.statusCode === 200) {
                        if (response.text)
                            data = response.text;
                        if (!_.isEmpty(response.body))
                            data = response.body;
                        resolve({status: response.statusCode, data: data});
                    } else {
                        reject(response);
                    }
                });
        } catch (err) {
            reject(err)
        }
    })
}


module.exports.superagentPost = superagentPost;
module.exports.superagentGet = superagentGet;
module.exports.superagentGetAcceptEncoding = superagentGetAcceptEncoding;
module.exports.superagentGetStreamType = superagentGetStreamType;
module.exports.superagentPostZaloEncodeUrl = superagentPostZaloEncodeUrl;
module.exports.superagentPostMultipartV01 = superagentPostMultipartV01;
module.exports.superagentPostMultipartV02 = superagentPostMultipartV02;