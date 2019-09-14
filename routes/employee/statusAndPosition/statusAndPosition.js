let express = require('express');
let router = express.Router();
let Status = require('../../../model/employee/statusAndPosition/Status');
let Position = require('../../../model/employee/statusAndPosition/Position');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'ICT') {
    next();
  } else {
    req.flash('auth_danger', 'Please sign in to continue !!!!!');
    res.redirect('/auth/users/signin');
  }
};

/**
* @method: get 
* @access: /employee/statusAndPosition/create
* @private: ict
* @description: display status and position
*/
router.get('/create', auth, (req, res) => {
  const success = req.flash('success');
  const danger = req.flash('danger');
  Status.find({}).sort({ status: -1 }).exec((err, status) => {
    if (err) throw err;
    Position.find({}).sort({ position: -1 }).exec((err, position) => {
      if (err) throw err;
      res.render('employee/statusAndPosition/statusAndPosition', {
        status, position,
        success, danger
      })
    });
  });
});

/**
* @method: get 
* @access: /employee/statusAndPosition/status/create
* @private: ict
* @description: create status
*/
router.post('/status/create', (req, res) => {
  Status.findOne({ status: req.body.status }, (err, status) => {
    if (err) {
      req.flash('danger', `${req.body.status} already exist`);
      res.redirect('/employee/statusAndPosition/create');
    } else {
      let newStatus = new Status({
        status: req.body.status
      });
      newStatus.save((err) => {
        if (err) throw err;
        req.flash('success', 'save successful');
        res.redirect('/employee/statusAndPosition/create');
      });
    }
  });
});

/**
* @method: get 
* @access: /employee/statusAndPosition/status/delete
* @private: ict
* @description: delete status
*/
router.get('/status/delete/:id', auth, (req, res) => {
  Status.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(`Unable to delete status: ${err}`);
    }
    req.flash('success', 'delete successful');
    res.redirect('/employee/statusAndPosition/create');
  });
});

// position

/**
* @method: get 
* @access: /employee/statusAndPosition/position/create
* @private: ict
* @description: create position
*/
router.post('/position/create', (req, res) => {
  Position.findOne({ status: req.body.status }, (err, position) => {
    if (err) {
      req.flash('danger', `${req.body.position} already exist`);
      res.redirect('/employee/statusAndPosition/create');
    } else {
      let newPosition = new Position({
        position: req.body.position
      });
      newPosition.save((err) => {
        if (err) throw err;
        req.flash('success', 'save successful');
        res.redirect('/employee/statusAndPosition/create');
      });
    }
  });
});

/**
* @method: get 
* @access: /employee/statusAndPosition/position/delete
* @private: ict
* @description: delete position
*/
router.get('/position/delete/:id', auth, (req, res) => {
  Position.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(`Unable to delete position: ${err}`);
    }
    req.flash('success', 'delete successful');
    res.redirect('/employee/statusAndPosition/create');
  });
});

module.exports = router;
