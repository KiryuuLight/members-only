require('dotenv').config();

const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const dbConnection = require('./config/db');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const logger = require('morgan');
const passport = require('passport');
const passportConfig = require('./config/passport');
const path = require('path');
const session = require('express-session');

// Connect db
dbConnection(process.env.DB_KEY);

// Create route
const indexRouter = require('./routes/index');

// Initialize Express
const app = express();

// Load strategy
passportConfig(passport);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Create session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

// Passport mdw

app.use(passport.initialize());
app.use(passport.session());

// Connect Flash

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  req.user ? (res.locals.user = req.user) : 'undefined';
  next();
});

// Routes

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
  res.render('error');
});

module.exports = app;
