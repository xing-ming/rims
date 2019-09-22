let express = require('express');
let router = express.Router();
let Category = require('../../model/product/Category');
let Brand = require('../../model/product/Brand');
let PaymentMethod = require('../../model/product/PaymentMethod');

// CONTROLLING BOTH CATEGORY AND BRAND

// security
let auth = function(req, res, next) {
  if (req.user && req.user.administrator === 'Accountant') {
    next();
  } else {
    res.redirect('/auth/users/signin');
  }
};

// CONTROLLING BOTH CATEGORY AND BRAND

/**
 * @method: get
 * @route: /product/category/create
 * @access: account
 * @description: display create category and create brand pages
 */
router.get('/create', auth, (req, res, next) => {
  let success = req.flash('success');
  let danger = req.flash('danger');
  Category.find((err, category) => {
    if (err) throw err;
    Brand.find((err, brand) => {
      if (err) throw err;
      PaymentMethod.find((err, payment_method) => {
        if (err) throw err;
        res.render('product/catalog', {
          success,
          danger,
          category,
          brand,
          payment_method
        });
      });
    });
  });
});

/**
 * method: post
 * route: /product/category/create
 * access: account
 * description: create category
 */
router.post('/create', function(req, res, next) {
  Category.findOne({
    category_name: req.body.category_name
  }, (err, category_name) => {
    if (category_name) {
      req.flash('danger', `${req.body.category_name} already exist`);
      res.redirect('/product/category/create');
    } else {
      newCat = new Category({
        category_name: req.body.category_name
      });
      newCat.save((err) => {
        if (err) {
          console.log(`Unable to save: ${err}`);
        }
        req.flash('success', 'save successful');
        res.redirect('/product/category/create');
      });
    }
  });
});

/**
 * route: /product/category/delete/id
 * access: account
 * description: delete category
 */
router.get('/delete/:id', auth, (req, res) => {
  Category.findByIdAndDelete({
    _id: req.params.id
  }, (err) => {
    if (err) throw err;
    req.flash('success', 'delete successful');
    res.redirect('/product/category/create');
  });
});

module.exports = router;
