const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, `.env`) });

const middleware = require('./src/middleware');
const errorHandler = middleware.errorHandler();
const bookings = require('./src/routes/bookings');
const morgan = require('morgan');

const app = express();

// view engine setup

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'dev') {
  app.use(morgan('dev'));
}

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.use('/bookings', bookings);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

const port = process.env.PORT;
const host = process.env.HOST || 'localhost';
// app.listen(port, 'ec2-3-82-214-166.compute-1.amazonaws.com');
app.listen(port, host);
console.log(`Running on http://${host}:${port}`);

module.exports = app;
