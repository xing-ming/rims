let express = require('express');
let router = express.Router();
let Category = require('../../model/product/Category');
let Brand = require('../../model/product/Brand');
let Item = require('../../model/product/Item');

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
 * @route : /product/item/create
 * @description: passing brand and category to user form
 * @access: product
 */
router.get('/create', auth, (req, res) => {
  let success = req.flash('success');
  let danger = req.flash('danger');
  Category.find({}).sort({
    _id: 1
  }).exec((err, categories) => {
    if (err) {
      throw err;
    }
    Brand.find({}).sort({
      _id: 1
    }).exec((err, brands) => {
      if (err) {
        throw err;
      }
      res.render('product/item', {
        brands,
        categories,
        success,
        danger
      });
    });
  });
});

/**
 * @method: post
 * @route : /product/item/create
 * @description: create item
 * @access: product
 */
router.post('/create', (req, res) => {
  if (req.body.item_id === '') {
    addItem(req, res);
  } else {
    updateItem(req, res);
  }
});

/**
 * @method: post
 * @abstract: call back function
 */
function addItem(req, res) {
  Item.findOne({
    item_name: req.body.item_name
  }, (err, item_name) => {
    if (item_name) {
      req.flash('danger', `${req.body.item_name} already exist`);
      res.redirect('/product/item/create');
    } else {
      newItem = new Item({
        item_name: req.body.item_name,
        item_quantity: req.body.item_quantity,
        item_price: req.body.item_price,
        category_name: req.body.category_name,
        brand_name: req.body.brand_name,
      });
      newItem.save((err) => {
        if (err) {
          console.log(`Unable to save: ${err}`);
        }
        req.flash('success', 'save successful');
        res.redirect('/product/item/display')
      });
    }
  });
}

/**
 * @method: get
 * @route : /product/item/edit/:id
 * @description: edit item
 * @access: product
 */
router.get('/edit/:id', auth, (req, res) => {
  Item.findById({
    _id: req.params.id
  }, (err, item) => {
    if (err) {
      console.log(`Unable to edit item: ${err}`);
    }
    Category.find((err, categories) => {
      if (err) {
        throw err;
      }
      Brand.find((err, brands) => {
        if (err) {
          throw err;
        }
        res.render('product/item', {
          item,
          categories,
          brands
        })
      });
    });
  });
});

/**
 * @method: post
 * @description: update item
 * @access: product
 */
function updateItem(req, res) {
  Item.findByIdAndUpdate({
    _id: req.body.item_id
  }, req.body, {
    new: true
  }, (err) => {
    if (err) {
      console.log(`Unable to update item: ${err}`);
    }
    req.flash('success', 'update successful');
    res.redirect('/product/item/display');
  });
}

/**
 * @method: get
 * @route : /product/item/delete/:id
 * @description: delete item
 * @access: product
 */
router.get('/delete/:id', auth, (req, res) => {
  Item.findByIdAndDelete({
    _id: req.params.id
  }, (err) => {
    if (err) {
      console.log(`Unable to delete item: ${err}`);
    }
    req.flash('success', 'delete successful');
    res.redirect('/product/item/display');
  });
});

/**
 * @method: get
 * @route : /product/item/display
 * @description: display item
 * @access: product
 */
router.get('/display', auth, (req, res) => {
  let success = req.flash('success');
  Item.find({}).sort({
    _id: -1
  }).exec((err, items) => {
    if (err) throw err
    Brand.find((err, brand) => {
      if (err) throw err;
      res.render('product/itemDisplay', {
        items,
        success,
        brand
      });
    });
  });
});

/**
 * @method: get
 * @route : /product/item/display/category/:category
 * @description: display item by category
 * @access: product
 */
router.get('/display/category/:category', auth, (req, res) => {
  Item.find({
    category_name: req.params.category
  }, (err, items) => {
    if (err) {
      throw err;
    }
    res.render('product/itemDisplay', {
      items
    });
  });
});

/**
 * @method: get
 * @route : /product/item/display/brand/:brand
 * @description: display item by brand
 * @access: product
 */
router.get('/display/brand/:brand', auth, (req, res) => {
  Item.find({
    brand_name: req.params.brand
  }, (err, items) => {
    if (err) {
      throw err;
    }
    res.render('product/itemDisplay', {
      items
    });
  });
});

module.exports = router;
