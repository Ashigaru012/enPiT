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
const loginRouter = require('./routes/login');
const rankingRouter = require('./routes/ranking');
const usersRouter = require('./routes/users');
const requestsRouter = require('./routes/requests');
const roomsRouter = require('./routes/rooms');

const usersTestRouter = require('./routes/test/users');
const mapTestRouter = require('./routes/test/map');
const map2TestRouter = require('./routes/test/map2');
const map3TestRouter = require('./routes/test/map3');
const map4TestRouter = require('./routes/test/map4');
const chatTestRouter = require('./routes/test/chat');
const chat2TestRouter = require('./routes/test/chat2');
const roomsTestRouter = require('./routes/test/rooms');
const requestsTestRouter = require('./routes/test/requests');
const requestTestRouter = require('./routes/test/request');
const rankingTestRouter = require('./routes/test/ranking');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', loginRouter.auth, indexRouter);
app.use('/login', loginRouter);
app.use('/ranking', rankingRouter);
app.use('/users', usersRouter);
app.use('/requests', requestsRouter);
app.use('/rooms', roomsRouter);

//app.use('/test/map', mapTestRouter);
//app.use('/test/map2', map2TestRouter);
//app.use('/test/map3', map3TestRouter);
app.use('/test/map4', map4TestRouter);
//app.use('/test/chat', chatTestRouter);
app.use('/test/chat2', chat2TestRouter);
app.use('/test/rooms', roomsTestRouter);
//app.use('/test/requests', requestsTestRouter);
app.use('/test/request', requestTestRouter);
app.use('/test/ranking', rankingTestRouter);
app.use('/test/users', usersTestRouter);


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

  if(req.ws)
  {
    console.error("ERROR from WS route - ", err);
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
