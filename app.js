var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var cors = require('cors')
require('dotenv').config();
const isClusterConnection = process.env.CLUSTER || false;
const port = process.env.PORT || 27017;
const connectURL = process.env.DATABASE_URL || "mongodb://127.0.0.1";
const dbname = process.env.DBNAME;
const connectString = connectURL+":"+port+"/"+dbname;
const clusterConnectionString = process.env.CLUSTER_CONNECTION_STRING;
var app = express();
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));

var indexRouter = require('./routes/index');
//hostname:port/
console.log("isClusterConnection: "+isClusterConnection);
if(isClusterConnection == "true"){
  mongoose.connect(clusterConnectionString)
  .then(function () {
      console.log("Cluster Connected");
    }
  ).catch(function (err) {
    console.log("Cluster connect failed! - "+err.message);
  })
}
else{
  mongoose.connect(connectString)
.then(function () {
    console.log("MongoDB Connected");
  }
).catch(function (err) {
  console.log(err.message);
})
}



app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message)
});

module.exports = app;
