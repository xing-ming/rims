let express = require('express');
let router = express.Router();
let Category = require('../../model/ict/Category');
let Brand = require('../../model/ict/Brand');
let Item = require('../../model/ict/Item');

// security
let auth = function(req, res, next) {
  if (req.user && req.user.administrator === 'ICT') {
    next();
  } else {
    req.flash('auth_danger', 'Please sign in to continue !!!!!');
    res.redirect('/auth/users/signin');
  }
};

/**
 * @method: get
 * @route : /ict/item/create
 * @description: passing brand and category to user form
 * @access: ict
 */
router.get('/create', auth, (req, res) => {
  let success = req.flash('success');
  let danger = req.flash('danger');
  Category.find({}).sort({
    category_name: 1
  }).exec((err, categories) => {
    if (err) {
      throw err;
    }
    Brand.find({}).sort({
      brand_name: 1
    }).exec((err, brands) => {
      if (err) {
        throw err;
      }
      res.render('ict/item', {
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
 * @route : /ict/item/create
 * @description: create item
 * @access: ict
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
      res.redirect('/ict/item/create');
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
        res.redirect('/ict/item/create')
      });
    }
  });
}

/**
 * @method: get
 * @route : /ict/item/edit/:id
 * @description: edit item
 * @access: ict
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
        res.render('ict/item', {
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
 * @access: ict
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
    res.redirect('/ict/item/display');
  });
}

/**
 * @method: get
 * @route : /ict/item/delete/:id
 * @description: delete item
 * @access: ict
 */
router.get('/delete/:id', auth, (req, res) => {
  Item.findByIdAndDelete({
    _id: req.params.id
  }, (err) => {
    if (err) {
      console.log(`Unable to delete item: ${err}`);
    }
    req.flash('success', 'delete successful');
    res.redirect('/ict/item/display');
  });
});

/**
 * @method: get
 * @route : /ict/item/display
 * @description: display item
 * @access: ict
 */
router.get('/display', auth, (req, res) => {
  let success = req.flash('success');
  let danger = req.flash('danger');
  Item.find({}).sort({
    _id: -1
  }).exec((err, items) => {
    if (err) throw err
    Brand.find((err, brand) => {
      if (err) throw err;
      res.render('ict/itemDisplay', {
        items,
        success,
        danger,
        brand
      });
    });
  });
});

/**
 * @method: get
 * @route : /ict/item/display/:category
 * @description: display item by category
 * @access: ict
 */
router.get('/display/category/:category', auth, (req, res) => {
  Item.find({
    category_name: req.params.category
  }, (err, items) => {
    if (err) {
      throw err;
    }
    res.render('ict/itemDisplay', {
      items
    });
  });
});

/**
 * @method: get
 * @route : /ict/item/display/:brand
 * @description: display item by brand
 * @access: ict
 */
router.get('/display/brand/:brand', auth, (req, res) => {
  Item.find({
    brand_name: req.params.brand
  }, (err, items) => {
    if (err) {
      throw err;
    }
    res.render('ict/itemDisplay', {
      items
    });
  });
});

module.exports = router;
