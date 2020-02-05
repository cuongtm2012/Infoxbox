const _ = require('lodash');

module.exports = {
    parseFloat: function (value) {
        if (_.isEqual(NaN, parseFloat(value)))
            return null;
        else
            return parseFloat(value);
    }
}