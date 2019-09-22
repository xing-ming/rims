const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts'),
  mongoose = require('mongoose'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session);
flash = require('connect-flash'),
  key = require('./config/key'),
  passport = require('passport');
require('./config/passport')(passport);

const app = express();

// view engine setup
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: key.security,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// global route and middlewares
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.session = req.session;
  res.locals.user = req.user || null;
  next();
});

// router initialization
app.use('/auth/users', require('./routes/auth/signup'));
app.use('/auth/users', require('./routes/auth/signin'));
// manager
app.use('/manager', require('./routes/manager/manager'));
app.use('/manager/accounting', require('./routes/manager/accounting/account'));
app.use('/manager/order', require('./routes/manager/accounting/orderDisplay'));
app.use('/manager/catalog', require('./routes/manager/catalog/catalog'));
app.use('/manager/employee', require('./routes/manager/employee/employee'));
app.use('/manager/payroll/payslip',  require('./routes/manager/employee/payslip'));
app.use('/manager/item', require('./routes/manager/item/item'));
app.use('/manager/signup/users', require('./routes/manager/users/displayUsers'));
app.use('/manager/employee/duty-roster', require('./routes/manager/roster/dutyRoster'));
// home page
app.use('/', require('./routes/home/index'));
// information communication technology base (ICT)
app.use('/ict/home', require('./routes/ict/ictHome'));
app.use('/employee/duty-roster', require('./routes/roster/dutyRoster'));
// Accountant
app.use('/product/category', require('./routes/product/category'));// controlling category and brand
app.use('/product/brand', require('./routes/product/brand'));
app.use('/product/item', require('./routes/product/item'));
app.use('/product/paymentMethod', require('./routes/product/paymentMethod'));
// casher base
app.use('/casher/home', require('./routes/casher/casherHome'));
app.use('/casher/item', require('./routes/casher/cart'));
app.use('/casher/item', require('./routes/casher/order'));
// accounting base
app.use('/accountant/home', require('./routes/accounting/accountantHome'));
app.use('/accountant/item', require('./routes/accounting/orderDisplayToAccountant'));
app.use('/accountant/day', require('./routes/accounting/day'));
app.use('/accountant/week', require('./routes/accounting/week'));
app.use('/accountant/month', require('./routes/accounting/month'));
app.use('/accountant/dayAccount', require('./routes/accounting/dayAccount'));
app.use('/accountant/weeklyAccount', require('./routes/accounting/weeklyAccount'));
app.use('/accountant/monthlyAccount', require('./routes/accounting/monthlyAccount'));
// employee
app.use('/employee/catalog', require('./routes/employee/departmentAndAllowance/departmentAndAllowance'));
app.use('/employee', require('./routes/employee/employee'));
app.use('/employee/statusAndPosition', require('./routes/employee/statusAndPosition/statusAndPosition'));
app.use('/payroll/payslip', require('./routes/employee/payslip/payslip'));
// expenses
app.use('/expensesAndBudget', require('./routes/expensesAndBudget/expensesAndBudget'));
// attendance
app.use('/attendance', require('./routes/attendance/attendance'));
// room booking
app.use('/guest/reservation', require('./routes/roombooking/reservation'));
app.use('/room/floor', require('./routes/roombooking/floor'));
app.use('/room/room-number', require('./routes/roombooking/room_number'));
app.use('/room/room-type', require('./routes/roombooking/room_type'));
app.use('/room/bedding-type', require('./routes/roombooking/bedding_type'));
app.use('/front-office-home', require('./routes/frontOffice/home'));

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
  res.render('error/error');
});

// server initialization
const port = process.env.PORT || 5000;
app.listen(port, (err) => {
  if (err) {
    console.log(`Error in database connection: ${err}`);
  } else {
    mongoose.connect(key.mongoURI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log(`Server runing on ${port}`);
  }
});

module.exports = app;
