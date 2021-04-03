import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import logger from './config/logger.js';
import morgan from 'morgan';
import fs from 'file-system';
import moment from 'moment-timezone';
import dateMoment from 'moment';
import path from 'path';
import config from './config/config.js';
import https from 'https';
import fss from 'fs';
import databaseInitialize from './config/db.config.js';
import methodOverride from 'method-override';
import cicExternalRoute from './routes/cicExternal.route.js';
import eContractRoute from './routes/eContract.route.js';
// import eKyc from './routes/eKyc.route';

const app = express();
const __dirname = path.resolve()
const __dad = path.join(__dirname, '..');
const privateKey = fss.readFileSync(path.join(__dad, 'sslcert', 'key.pem'), 'utf8');
const certificate = fss.readFileSync(path.join(__dad, 'sslcert', 'cert.pem'), 'utf8');
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);
// create oracle pool.
databaseInitialize().then();
//Turn of SSL SSL certificate verification
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.use(cors());
app.use(express.static('public'));
// get request parametters
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(methodOverride(function (req, res) {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		var method = req.body._method;
		delete req.body._method;
		return method;
	}
}));

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

//access to router
app.use('/external', cicExternalRoute);
app.use('/contract', eContractRoute);
// app.use('/kyc', eKyc);

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
	if (tokens.status(req, res) === 200) {
		logger.info(debugIncomingRequest);
	} else {
		logger.error(debugIncomingRequest);
	}
}));
// LOGS
import uuid from 'node-uuid';
import {createNamespace} from 'continuation-local-storage';
import initialize from "./config/db.config.js";
let myRequest = createNamespace('my request');

// Run the context for each request. Assign a unique identifier to each request
app.use(function (req, res, next) {
	myRequest.run(function () {
		myRequest.set('reqId', uuid.v1());
		next();
	});
});
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// add this line to include winston logging
	logger.error(`${dateMoment(new Date()).format('YYYY-MM-DD hh:mm:ss')} - ${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

httpsServer.listen(config.server.port, function () {
	console.log('Server running at port', config.server.port);
});
