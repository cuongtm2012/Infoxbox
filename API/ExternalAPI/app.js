var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var winston = require('./config/winston');
var morgan = require('morgan');
var fs = require('file-system');

const https = require('https');
const fss = require('fs');
const privateKey = fss.readFileSync('./sslcert/key.pem', 'utf8');
const certificate = fss.readFileSync('./sslcert/cert.pem', 'utf8');

var app = express();
app.use(cors());
app.use(express.static('public'));
// get request parametters
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

var cicExternalRoute = require('./routes/cicExternal.route');
var cicMobileRoute = require('./routes/cicMobile.route');

// Config DB
var config = require('./config/config');

var methodOverride = require('method-override');
app.use(methodOverride(function (req, res) {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		var method = req.body._method;
		delete req.body._method;
		return method;
	}
}));

var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

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
app.use(morgan('combined', { stream: winston.stream }));
//configure log
var createFolder = function ensureDirSync(dirpath) {
	try {
		return fs.mkdirSync(dirpath)
	} catch (err) {
		if (err.code !== 'EEXIST') throw err
	}
};

// LOGS
var uuid = require('node-uuid');
var createNamespace = require('continuation-local-storage').createNamespace;
var myRequest = createNamespace('my request');
// initialize log folder
createFolder(config.log.orgLog);

// Run the context for each request. Assign a unique identifier to each request
app.use(function (req, res, next) {
	myRequest.run(function () {
		myRequest.set('reqId', uuid.v1());
		next();
	});
});



// validator
// app.use(expressValidator());

app.use('/external', cicExternalRoute);
app.use('/mobile', cicMobileRoute);


app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// add this line to include winston logging
	winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(config.server.port, function () {
	console.log('Server running at port', config.server.port);
});
