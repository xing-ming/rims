var express = require('express');
var router = express.Router();
const Item = require('../../model/ict/Item');
const Cart = require('../../model/casher/Cart');
const PaymentMethod = require('../../model/ict/PaymentMethod');
const Department = require('../../model/employee/department/Department');

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
 * @access: /casher/item/display
 * @description: display item to casher
 * @private: casher
 */
router.get('/display', auth, (req, res) => {
  Item.find({}).sort({ item_name: 1 }).exec((err, items) => {
    if (err) {
      throw err;
    } else {
      res.render('casher/casherItemDisplay', { items });

    }
  });
});

/**
 * @method: get
 * @access: /casher/item/display/:category
 * @description: display item by category
 * @private: casher
 */
router.get('/display/category/:category', auth, (req, res) => {
  Item.find({ category_name: req.params.category }, (err, items) => {
    if (err) {
      throw err;
    }
    res.render('casher/casherItemDisplay', {
      items
    });
  });
});

/**
 * @method: get
 * @access: /casher/item/display/:brand
 * @description: display item by brand
 * @private: casher
 */
router.get('/display/brand/:brand', auth, (req, res) => {
  Item.find({ brand_name: req.params.brand }, (err, items) => {
    if (err) {
      throw err;
    }
    res.render('casher/casherItemDisplay', {
      items
    });
  });
});

/**
 * @method: get
 * @access: /casher/item/add-item-to-cart/:id
 * @description: display cart item
 * @private: casher
 */
router.get('/add-item-to-cart/:id', auth, (req, res) => {
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  Item.findById({ _id: req.params.id }, (err, item) => {
    if (err) {
      console.log(`Unable to add item to cart: ${err}`);
    } else {
      cart.add(item, item.id);
      req.session.cart = cart;
      // console.log(req.session.cart);
      res.redirect('/casher/item/display');
    }
  });
});

/**
 * @method: get
 * @access: /casher/item/reduce-by-one
 * @description: remove item in cart by one
 * @private: casher
 */
router.get('/reduce-by-one/:id', auth, (req, res) => {
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(req.params.id);
  req.session.cart = cart;
  // console.log(req.session.cart);
  res.redirect('/casher/item/cart-display');
});

/**
 * @method: get
 * @access: /casher/item/remove-all
 * @description: remove all item in cart
 * @private: casher
 */
router.get('/remove-all/:id', auth, (req, res) => {
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeAll(req.params.id);
  req.session.cart = cart;
  // console.log(req.session.cart);
  res.redirect('/casher/item/cart-display');
});

/**
 * @method: get
 * @access: /casher/item/clear-cart
 * @description: clear cart
 * @private: casher
 */
router.get('/clear-cart', auth, (req, res) => {
  Item.find({}).sort({ item_name: 1 }).exec((err, items) => {
    if (err) {
      throw err;
    } else {
      let cart = new Cart(req.session.cart);
      req.session.cart = null;
      res.redirect('/casher/item/display');
    }
  });
});

/**
 * @method: get
 * @access: /casher/item/cart-display
 * @description: display cart to casher
 * @private: casher
 */
router.get('/cart-display', auth, (req, res) => {
  const success = req.flash('success');
  if (!req.session.cart) {
    return res.render('casher/cartItem', { items: null });
  }
  let cart = new Cart(req.session.cart);
  PaymentMethod.find((err, payment) => {
    if (err) throw err
    Department.find((err, department) => {
      if (err) throw err;
      res.render('casher/cartItem', {
        items: cart.generateArray(),
        totalPrice: cart.totalPrice,
        payment,
        department,
        success
      });
    });
  });
});

/**
 * @method: get
 * @access: /casher/item/invoice
 * @description: print invoice
 * @private: casher
 */
router.get('/invoice', auth, (req, res) => {
  if (!req.session.cart) {
    return res.render('casher/cartItem', { items: null });
  }
  let cart = new Cart(req.session.cart);
  req.session.cart = null;
  res.render('casher/invoice', {
    items: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
});

/**
 * @method: post, { update }
 * @access: /casher/item/save
 * @description: subtract order quantity and save the order by it comsumer quantity demand
 * @private: casher
 */
router.post('/save', (req, res) => {
  Item.findOne({ item_name: req.body.item_name }, (err, item_name) => {
    if (req.body.item_id !== '') {
      updateItem(req, res);
    } else {
      if (req.body.item_id === '') {
        req.flash('danger', `sorry unable to save the item`);
        res.redirect('/casher/item/cart-display');
      }
    }
  });
});

/**
 * @method: get
 * @access: /casher/item/edit/:id
 * @description: edit item by adding the comsumer quantity
 * @private: casher
 */
router.get('/edit/:id', auth, (req, res) => {
  Item.findById({ _id: req.params.id }, (err, item) => {
    if (err) {
      console.log(`Unable to edit item: ${err}`);
    }
    res.render('casher/itemUpdate', { item });
  });
});

/**
 * @method: update call function
 * @description: update item
 * @private: casher
 */
function updateItem(req, res) {
  Item.findByIdAndUpdate({ _id: req.body.item_id }, req.body, { new: true }, (err) => {
    if (err) {
      console.log(`Unable to update item: ${err}`);
    }
    req.flash('success', `${req.body.item_name} save & ready to sale`);
    res.redirect('/casher/item/cart-display');
  });
}

module.exports = router;
