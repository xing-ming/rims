let express = require('express');
let router = express.Router();
const Category = require('../../model/product/Category');
const Brand = require('../../model/product/Brand');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Cashier') {
    next();
  } else {
    req.flash('auth_danger', 'Please sign in to continue !!!!!');
    res.redirect('/auth/users/signin');
  }
};

/**
 * @method: get
 * @access: /casher/home/casher-home
 * @private: casher
 * @description: display casher home base
 */
router.get('/casher-home', auth, (req, res) => {
  Category.find((err, category) => {
    if (err) throw err;
    Brand.find((err, brand) => {
      if (err) throw err;
      res.render('casher/casherHome', {
        category,
        brand
      });
    });
  });
});

module.exports = router;
