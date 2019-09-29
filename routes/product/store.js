let express = require('express');
let router = express.Router();
let Store = require('../../model/product/Store');
let csrf = require('csurf'),
  csrfProtection = csrf();
router.use(csrfProtection);

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Accountant') {
    next();
  } else {
    res.redirect('/auth/users/signin');
  }
};

/**
 * @method: get
 * @route : /product/store/create
 * @description: create product in store
 * @access: product
 */
router.get('/create', auth, (req, res) => {
  let success = req.flash('success');
  let danger = req.flash('danger');
  res.render('product/store', {
    success,
    danger,
    csrfToken: req.csrfToken()
  });
});

/**
 * @method: post
 * @route : /product/store/create
 * @description: create store product
 * @access: product
 */
router.post('/create', (req, res) => {
  if (req.body.product_id === '') {
    addProduct(req, res);
  } else {
    updateProduct(req, res);
  }
});

/**
 * @method: post
 * @abstract: call back function
 */
function addProduct(req, res) {
  Store.findOne({
    product_name: req.body.product_name
  }, (err, product_name) => {
    if (product_name) {
      req.flash('danger', `${req.body.product_name} already exist`);
      res.redirect('/product/store/create');
    } else {
      newProduct = new Store({
        product_name: req.body.product_name,
        new_carton_quantity: req.body.new_carton_quantity,
        new_carton_qty_unit: req.body.new_carton_qty_unit,
        new_carton_price_unit: req.body.new_carton_price_unit,
        new_carton_total_qty: req.body.new_carton_total_qty,
        new_product_total_amount: req.body.new_product_total_amount,

        old_carton_quantity: req.body.old_carton_quantity,
        old_carton_qty_unit: req.body.old_carton_qty_unit,
        old_carton_price_unit: req.body.old_carton_price_unit,
        sale_qty: req.body.sale_qty,
        qty_remainder: req.body.qty_remainder,
        old_carton_total_qty: req.body.old_carton_total_qty,
        old_product_total_amount: req.body.old_product_total_amount,
      });
      newProduct.save((err) => {
        if (err) throw err;
        req.flash('success', 'save successful');
        res.redirect('/product/store/displayProduct');
      });
    }
  });
}

/**
 * @method: get
 * @route : /product/store/edit/:id
 * @description: edit product in store
 * @access: product
 */
router.get('/edit/:id', auth, (req, res) => {
  Store.findById({ _id: req.params.id }, (err, product) => {
    if (err) throw err;
    res.render('product/store', {
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
    res.redirect('/product/store/displayProduct');
  });
}

/**
 * @method: get
 * @route : /product/store/delete/:id
 * @description: delete product in store
 * @access: product
 */
router.get('/delete/:id', auth, (req, res) => {
  Store.findByIdAndDelete({
    _id: req.params.id
  }, (err) => {
    if (err) throw err;
    req.flash('success', 'delete successful');
    res.redirect('/product/store/displayProduct');
  });
});

/**
 * @method: get
 * @route : /product/store/displayProduct
 * @description: display product
 * @access: product
 */
router.get('/displayProduct', auth, (req, res) => {
  let success = req.flash('success');
  Store.find({}).sort({
    _id: -1
  }).exec((err, product) => {
    if (err) throw err
    res.render('product/displayProduct', {
      product,
      success
    });
  });
});

module.exports = router;