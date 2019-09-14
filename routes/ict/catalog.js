let express = require('express');
let router = express.Router();
let Category = require('../../model/ict/Category');
let Brand = require('../../model/ict/Brand');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'ICT') {
    next();
  } else {
    req.flash('auth_danger', 'Please sign in to continue !!!!!');
    res.redirect('/auth/users/signin');
  }
};

// CONTROLLING BOTH CATEGORY AND BRAND

/**
 * method: get
* route: /ict/catalog/category/brand/create
* access: ict
* description: display create category and create brand pages
*/
router.get('/category/brand/create', auth, (req, res, next) => {
  let success = req.flash('success');
  let danger = req.flash('danger');
  Category.find((err, category) => {
    if (err) throw err;
    Brand.find((err, brand) => {
      if (err) throw err;
      res.render('ict/catalog', {
        success, danger,
        category, brand
      });
    });
  });
});

/**
 * method: post
 * route: /ict/catalog/category/create
 * access: ict
 * description: create category
 */
router.post('/category/create', function (req, res, next) {
  Category.findOne({ category_name: req.body.category_name }, (err, category_name) => {
    if (category_name) {
      req.flash('danger', `${req.body.category_name} already exist`);
      res.redirect('/ict/catalog/category/brand/create');
    } else {
      newCat = new Category({
        category_name: req.body.category_name
      });
      newCat.save((err) => {
        if (err) {
          console.log(`Unable to save: ${err}`);
        }
        req.flash('success', 'save successful');
        res.redirect('/ict/catalog/category/brand/create');
      });
    }
  });
});

/**
 * route: /ict/catalog/category/delete/id
 * access: ict
 * description: delete category
 */
router.get('/category/delete/:id', auth, (req, res) => {
  Category.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(`Unable to delete category: ${err}`);
    }
    req.flash('success', 'delete successful');
    res.redirect('/ict/catalog/category/brand/create');
  });
});

// brand start

/**
 * @method: post
 * @access: /ict/catalog/brand/create
 * @private: ict
 * @description: create brand
 */
router.post('/brand/create', function (req, res, next) {
  Brand.findOne({ brand_name: req.body.brand_name }, (err, brand_name) => {
    if (brand_name) {
      req.flash('danger', `${req.body.brand_name} already exist`);
      res.redirect('/ict/catalog/category/brand/create');
    } else {
      newBrand = new Brand({
        brand_name: req.body.brand_name
      });
      newBrand.save((err) => {
        if (err) {
          console.log(`Unable to save: ${err}`);
        }
        req.flash('success', 'save successful');
        res.redirect('/ict/catalog/category/brand/create')
      });
    }
  });
});

/**
 * @method: get
 * @access: /ict/catalog/brand/delete/id
 * @private: ict
 * @description: delete brand
 */
router.get('/brand/delete/:id', auth, (req, res) => {
  Brand.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(`Unable to delete brand: ${err}`);
    }
    req.flash('success', 'delete successful');
    res.redirect('/ict/catalog/category/brand/create');
  });
});

module.exports = router;
