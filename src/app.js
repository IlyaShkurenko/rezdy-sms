const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, `.env`) });

const middleware = require('./middleware');
const { logger } = require('./lib/logger');

const morgan = require('morgan');
const db = require('./db');

const errorHandler = middleware.errorHandler(logger, db.Error);
const app = express();

db.connect(process.env.MONGO_URI, process.env.DB_USER, process.env.DB_PASS, logger, { useNewUrlParser: true });

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

const normalizedPath = require('path').join(__dirname, 'api');

require('fs')
  .readdirSync(normalizedPath)
  .filter(i => i.includes('.js'))
  .forEach(i => {
    const route = i.slice(0, -3);
    app.use(`/${route}`, require(`./api/${route}`));
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
