const maxSizeRequestV01orV02 = 10485760;
const maxSizeRequestV01andV02 = 15728640;

export function checkRequestV01orV02(req, res, next) {
    let sizeRequest = parseInt(req.headers['content-length']);
    if (sizeRequest > maxSizeRequestV01orV02) {
        console.log('sizeRequestV01orV02: ', sizeRequest);
        res.status(413).send('HTTP content length exceeded 10485760 bytes.');
    } else {
        next();
    }
}

export function checkRequestV01AndV02(req, res, next) {
    let sizeRequest = parseInt(req.headers['content-length']);
    if (sizeRequest > maxSizeRequestV01andV02) {
        console.log('sizeRequestV01andV02: ', sizeRequest);
        res.status(413).send('HTTP content length exceeded 15728640 bytes.');
    } else {
        next();
    }
}