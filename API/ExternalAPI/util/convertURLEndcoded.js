const qs = require('querystring');


const convertJsonURL = function (input) {
    // "?inJsonList=%5B" + querystrings + "%5D"
    // convert json to x-wwww-form-urlendcoded
    // add %5B "[" into ahead qs.stringify and %5D "]" end stringify
    // var urlData = formurlencoded(input);
    // console.log("sdadd=====", encodeURIComponent(JSON.stringify(input)));
    return "?inJsonList=%5B" + qs.stringify(input).substring(0, qs.stringify(input).length - 1) + "%5D";
}

module.exports = {
    convertJsonURL: convertJsonURL
};