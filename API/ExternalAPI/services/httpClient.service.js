const config = require('../config/config');
const superagent = require('superagent');
const _ = require('lodash');
function superagentGet(url, query, Authorization) {
    return new Promise((resolve, reject) => {
        try {
            let data;
            superagent
                .get(url)
                .query() // query string
                .set('Authorization', Authorization)
                .end((err, res) => {
                    if (res.statusCode === 200) {
                        if (res.text)
                            data = res.text;
                        if (!_.isEmpty(res.body))
                            data = res.body;
                        resolve({status: res.statusCode, data: data});
                    } else {
                        reject(res);
                    }
                });
        } catch (err) {
            console.log(err.toString());
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
                .timeout(60*1000)
                .end((err, response) => {
                    if (response.statusCode === 200) {
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
            console.log(err.toString());
            reject(err)
        }
    })
}


module.exports.superagentPost = superagentPost;
module.exports.superagentGet = superagentGet;