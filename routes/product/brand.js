let express = require('express');
let router = express.Router();
let Brand = require('../../model/product/Brand');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Accountant') {
    next();
  } else {
    res.redirect('/auth/users/signin');
  }
};

/**
 * @method: post
 * @access: /product/brand/create
 * @private: account
 * @description: create brand
 */
router.post('/create', function (req, res, next) {
  Brand.findOne({ brand_name: req.body.brand_name }, (err, brand_name) => {
    if (brand_name) {
      req.flash('danger', `${req.body.brand_name} already exist`);
      res.redirect('/product/category/create');
    } else {
      newBrand = new Brand({
        brand_name: req.body.brand_name
      });
      newBrand.save((err) => {
        if (err) throw err;
        req.flash('success', 'save successful');
        res.redirect('/product/category/create')
      });
    }
  });
});

/**
 * @method: get
 * @access: /product/brand/delete/id
 * @private: account
 * @description: delete brand
 */
router.get('/delete/:id', auth, (req, res) => {
  Brand.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) throw err;
    req.flash('success', 'delete successful');
    res.redirect('/product/category/create');
  });
});

module.exports = router;
