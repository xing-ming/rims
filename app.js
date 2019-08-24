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
  key = require('./config/key');

const app = express();

// golbal router on database
// model
const Category = require('./model/ict/Category');
const Brand = require('./model/ict/Brand');
const Department = require('./model/employee/Department');

Category.find({}).sort({ category_name: 1 }).exec((err, category) => {
  if (err) {
    console.log(`server can not display category: ${err}`);
  } else {
    app.locals.category = category
  }
});

Brand.find({}).sort({ brand_name: 1 }).exec((err, brand) => {
  if (err) {
    console.log(`server can not display brand: ${err}`);
  } else {
    app.locals.brand = brand
  }
});

Department.find({}).sort({ department_name: -1 }).exec((err, department) => {
  if (err) {
    console.log(`server can not display department: ${err}`);
  } else {
    app.locals.department = department
  }
});

// view engine setup
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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
app.use(express.static(path.join(__dirname, 'public')));

// global route and middlewares
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// router initialization
app.use('/users', require('./routes/users/users'));
// home page
app.use('/', require('./routes/home/index'));
// information communication technology base
app.use('/ict/home', require('./routes/ict/ictHome'));
// app.use('/ict/brand', require('./routes/ict/brand'));
app.use('/ict/catalog', require('./routes/ict/catalog'));
app.use('/ict/item', require('./routes/ict/item'));
app.use('/ict/paymentMethod', require('./routes/ict/paymentMethod'));
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
app.use('/employee/department', require('./routes/employee/department'));

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
    mongoose.connect('mongodb://inteligent:text1234@ds149596.mlab.com:49596/rims', {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log(`Server runing on ${port}`);
  }
});

module.exports = app;
