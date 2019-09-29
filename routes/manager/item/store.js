let express = require('express');
let router = express.Router();
let Store = require('../../../model/product/Store');
let csrf = require('csurf'),
  csrfProtection = csrf();
router.use(csrfProtection);

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Manager' || req.user && req.user.administrator === 'Developer') {
    next();
  } else {
    res.redirect('/auth/users/signin');
  }
};

/**
 * @method: post
 * @route : /manager/store/create
 * @description: create store product
 * @access: product
 */
router.post('/create', (req, res) => {
  if (req.body.product_id !== '') {
    updateProduct(req, res);
  }
});

/**
 * @method: get
 * @route : /manager/store/edit/:id
 * @description: edit product in store
 * @access: product
 */
router.get('/edit/:id', auth, (req, res) => {
  Store.findById({ _id: req.params.id }, (err, product) => {
    if (err) throw err;
    res.render('manager/item/store', {
      product,
      csrfToken: req.csrfToken()
    });
  });
});

/**
 * @method: post
 * @description: update item
 * @access: account
 */
function updateProduct(req, res) {
  Store.findByIdAndUpdate({
    _id: req.body.product_id
  }, req.body, {
    new: true
  }, (err) => {
    if (err) throw err;
    req.flash('success', 'update successful');
    res.redirect('/manager/store/displayProduct');
  });
}

/**
 * @method: get
 * @route : /manager/store/delete/:id
 * @description: delete product in store
 * @access: product
 */
router.get('/delete/:id', auth, (req, res) => {
  Store.findByIdAndDelete({
    _id: req.params.id
  }, (err) => {
    if (err) throw err;
    req.flash('success', 'delete successful');
    res.redirect('/manager/store/displayProduct');
  });
});

/**
 * @method: get
 * @route : /manager/store/displayProduct
 * @description: display product
 * @access: product
 */
router.get('/displayProduct', auth, (req, res) => {
  let success = req.flash('success');
  Store.find({}).sort({
    _id: -1
  }).exec((err, product) => {
    if (err) throw err
    res.render('manager/item/displayProduct', {
      product,
      success
    });
  });
});

module.exports = router;