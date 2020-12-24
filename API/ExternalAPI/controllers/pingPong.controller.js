exports.pingPong = function (req, res) {
    let dateNow = new Date();
    const body = {
        status: "success",
        message: "pong",
        date: dateNow.toISOString()
    }
    res.status(200).send(body);
}