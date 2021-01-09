const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

var app = express();
var http = require('http');
app.server = http.createServer(app);

const ws = require('express-ws')(app, app.server);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const ajaxRouter = require('./routes/ajax'); 
const databaseRouter = require('./routes/test-database');
const mapTestRouter = require('./routes/test/map');
const map2TestRouter = require('./routes/test/map2');
const chatTestRouter = require('./routes/test/chat');
const chat2TestRouter = require('./routes/test/chat2');
const requestsTestRouter = require('./routes/test/requests');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ajax', ajaxRouter);
app.use('/test-database', databaseRouter);
app.use('/test/map', mapTestRouter);
app.use('/test/map2', map2TestRouter);
app.use('/test/chat', chatTestRouter);
app.use('/test/chat2', chat2TestRouter);
app.use('/test/requests', requestsTestRouter);


app.use(express.static('public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
