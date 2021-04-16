var winston = require('./config/winston');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var app = express();
var cors = require('cors');
let CronJob = require('cron').CronJob;
const logic = require('./logic');
// create oracle pool.
const database = require('./config/db.config');
database.initialize().then().catch();
//
let job = new CronJob('* * * * * *', async function(){
    job.stop();
    await logic().then(r => {
      if(r){
          job.start();
      }
    })
}, function(){ }, false);

job.start();

app.use(cors());
app.use(morgan('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
