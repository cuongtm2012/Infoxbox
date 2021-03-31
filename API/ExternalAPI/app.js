import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import winston from './config/winston';
// import logger from './config/logger';
import morgan from 'morgan';
import fs from 'file-system';
import moment from 'moment-timezone';
import dateMoment from 'moment';
import path from 'path';

import https from 'https';
import fss from 'fs';
const __dad = path.join(__dirname, '..');
const privateKey = fss.readFileSync(path.join(__dad, 'sslcert', 'key.pem'), 'utf8');
const certificate = fss.readFileSync(path.join(__dad, 'sslcert', 'cert.pem'), 'utf8');
// create oracle pool.
// const database = require('./config/db.config');
// database.initialize().then();
//Turn of SSL SSL certificate verification
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var app = express();
app.use(cors());
app.use(express.static('public'));
// get request parametters
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json({limit: '50mb'}));


//Timeout
// var timeout = require('connect-timeout');
// app.use(timeout(100 * 1000));
// app.use(haltOnTimedout);

// var cicExternalRoute = require('./routes/cicExternal.route');
import eContractRoute from './routes/eContract.route';
// var eKyc = require('./routes/eKyc.route');

// Config DB
import config from './config/config';

import methodOverride from 'method-override';
app.use(methodOverride(function (req, res) {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		var method = req.body._method;
		delete req.body._method;
		return method;
	}
}));

import flash from 'express-flash';
import cookieParser from 'cookie-parser';
import session from 'express-session';

app.use(cookieParser('keyboard cat'));
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 60000
	}
}));
app.use(flash());

//logging winston
morgan.token('date', (req, res, tz) => {
	return moment().tz(tz).format();
})
morgan.format('myformat', '[:date[Asia/Ho_Chi_Minh]] ":method :url" :status :res[content-length] - :response-time ms');
app.use(morgan(function (tokens, req, res) {
	let debugIncomingRequest = [
		dateMoment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length')+'B', '-',
		tokens['response-time'](req, res), 'ms'
	].join(' ');
	if (tokens.status(req, res) == 200) {
		// logger.info(debugIncomingRequest);
	} else {
		// logger.error(debugIncomingRequest);
	}
}));
//configure log
var createFolder = function ensureDirSync(dirpath) {
	try {
		return fs.mkdirSync(dirpath);
	} catch (err) {
		if (err.code !== 'EEXIST') throw err
	}
};

// LOGS
import uuid from 'node-uuid';
import {createNamespace} from 'continuation-local-storage';
var myRequest = createNamespace('my request');
// initialize log folder
// createFolder(config.log.orgLog);

// Run the context for each request. Assign a unique identifier to each request
app.use(function (req, res, next) {
	myRequest.run(function () {
		myRequest.set('reqId', uuid.v1());
		next();
	});
});



// validator
// app.use(expressValidator());

// app.use('/external', cicExternalRoute);
app.use('/contract', eContractRoute);
// app.use('/kyc', eKyc);
//Timeout
// function haltOnTimedout(req, res, next) {
// 	if (!req.timedout) next();
// 	else {
// 		console.log('Error server response time out');
// 		return res.status(503).json('Timeout error');
// 	}
// }

app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// add this line to include winston logging
	// logger.error(`${dateMoment(new Date()).format('YYYY-MM-DD hh:mm:ss')} - ${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(config.server.port, function () {
	console.log('Server running at port', config.server.port);
});
