var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const multer=require('multer');
const fs=require('fs');
const moment=require('moment')
//在public/upload的文件下；通过当前日期创建目录
let uploadDir='./public/images';
fs.mkdirSync(uploadDir,{
    recursive:true  //递归创建目录
});
//multer配置
let upload=multer({dest:uploadDir});

// 引入session
var session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors(
  {
    origin: ["http://192.168.43.16:8080","http://192.168.43.16:8081","http://172.20.10.2:8080"],
    credentials: true,
  }
));
app.use(upload.any())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: '12345', // 对sessionId进行cookie签名
  cookie: {maxAge: 1000 * 60 * 60 * 24}, // 设置session的有效时间, 单位ms
  resave: true,
  saveUninitialized: true,
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
