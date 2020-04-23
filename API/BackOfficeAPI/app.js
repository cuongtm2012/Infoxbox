
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var winston = require('./config/winston');
var morgan = require('morgan');
var fs = require('file-system');

var app = express();
app.use(cors());
app.use(express.static('public'));
// get request parametters
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

const https = require('https');
const fss = require('fs');
var path = require('path');
const __dad = path.join(__dirname, './');
const privateKey = fss.readFileSync(path.join(__dad, 'sslcert', 'key.pem'), 'utf8');
const certificate = fss.readFileSync(path.join(__dad, 'sslcert', 'cert.pem'), 'utf8');

const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

var auth = require('./routes/auth.route');
var customer = require('./routes/customer.route');
var contract = require('./routes/contract.route');
var code = require('./routes/code.route');
var cicreport = require('./routes/cicreport.route');
var user = require('./routes/user.route');
var captcha = require('./routes/captcha.route');
var manualCaptcha = require('./routes/manualCT.route');
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

app.use('/auth', auth);
app.use('/customer', customer);
app.use('/contract', contract);
app.use('/code', code);
app.use('/cicreport', cicreport);
app.use('/user', user);
app.use('/captcha', captcha);
app.use('/manualCaptcha', manualCaptcha);

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
httpsServer.listen(config.server.port, function () {
	console.log('Server running at port', config.server.port);
});

/*
**Socket
**********Start****************
*/
// let server = https.createServer(credentials, app);
//socket.io instantiation
let socketIO = require('socket.io');
let io = socketIO.listen(httpsServer, { log: false, origins: '*:*' });
//listen on every connection
io.on('connection', (socket) => {
	console.log('socket connected')

	//listen on new_message
	socket.on('new_message', (data) => {
		//broadcast the new message
		io.sockets.emit('new_message', { username: data.username, message: data.message });
		// io.sockets.emit('new_message', { message: massage });
	})

	//listen on typing
	socket.on('typing', (data) => {
		socket.broadcast.emit('typing', { username: socket.username })
	})

	//listen on External
	socket.on('External_message', (data) => {
		io.sockets.emit('External_message', data);
	})
	//listen on Internal batch process
	socket.on('Internal_message', (data) => {
		io.sockets.emit('Internal_message', data);
	})

	// colse socket
	socket.on('end', function () {
		socket.disconnect(0);
	});
});

// server.listen(config.server.socket, () => {
// 	console.log(`started on port: ${config.server.socket}`);
// });

/*
************end**************
*/
