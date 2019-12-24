
module.exports = {
    getIPGateWay: function (req) {
        //req.headers['x-forwarded-for'] || '').split(',').pop() ||
        // var ip = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
        //     req.connection.remoteAddress ||
        //     req.socket.remoteAddress ||
        //     req.connection.socket.remoteAddress;
        var ips = "localhost";

        return ips;
    }
}