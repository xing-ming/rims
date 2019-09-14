var express = require('express');
var router = express.Router();
const Expenses = require('../../model/expenses/Expenses');
const Budget = require('../../model/budget/Budget');
const Category = require('../../model/ict/Category');
const Brand = require('../../model/ict/Brand');

// security
let auth = function (req, res, next) {
  if (req.user && req.user.administrator === 'Accountant') {
    next();
  } else {
    req.flash('auth_danger', 'Please sign in to continue !!!!!');
    res.redirect('/auth/users/signin');
  }
};

/**
* @method: get 
* @access: /expensesAndBudget/create
* @private: now accountant
* @description: display expenses and budget
*/
router.get('/create', auth, (req, res) => {
  Category.find((err, category) => {
    if (err) throw err;
    Brand.find((err, brand) => {
      if (err) throw err;
      res.render('expensesAndBudget/expensesAndBudget', {
        category,
        brand
      });
    });
  });
});

/**
* @method: get 
* @access: /expensesAndBudget/expenses/create
* @private: now accountant
* @description: create expenses
*/
router.post('/expenses/create', (req, res) => {
  if (req.body.expenses_id === '') {
    addExpenses(req, res);
  } else {
    updateExpenses(req, res);
  }
});

/**
* @method: get 
* @access: /expensesAndBudget/expenses/create
* @private: now accountant
* @description: create expenses
*/
function addExpenses(req, res) {
  const newExpenses = new Expenses({
    expenses_type: req.body.expenses_type,
    amount: req.body.amount,
    detail: req.body.detail
  });
  newExpenses.save()
    .then(() => {
      req.flash('success', 'save successful');
      res.redirect('/expensesAndBudget/expenses/display');
    })
    .catch(err => console.log(err));
}

/**
* @method: get 
* @access: /expensesAndBudget/expenses/edit/id
* @private: now accountant
* @description: create expenses
*/
router.get('/expenses/edit/:id', auth, (req, res) => {
  Expenses.findById({ _id: req.params.id }, (err, expenses) => {
    if (err) {
      console.log(`Unable to edit expenses: ${err}`);
    }
    Category.find((err, category) => {
      if (err) throw err;
      Brand.find((err, brand) => {
        if (err) throw err;
        res.render('expensesAndBudget/expensesAndBudget', {
          expenses,
          category,
          brand
        });
      });
    });
  });
});

/**
* @method: get 
* @access: /expenses/edit/id
* @private: now accountant
* @description: create expenses
*/
function updateExpenses(req, res) {
  Expenses.findByIdAndUpdate({ _id: req.body.expenses_id }, req.body, { new: true }, (err) => {
    if (err) {
      console.log(`Unable to update expenses: ${err}`);
    }
    req.flash('success', 'update successful');
    res.redirect('/expensesAndBudget/expenses/display');
  });
}

/**
* @method: get 
* @access: /expensesAndBudget/expenses/display
* @private: now accountant
* @description: display expenses
*/
router.get('/expenses/display', auth, (req, res) => {
  const success = req.flash('success');
  const danger = req.flash('danger');
  Expenses.find({}).sort({ createdAt: -1 }).exec((err, expenses) => {
    if (err) throw err;
    res.render('expensesAndBudget/expensesDisplay', {
      expenses,
      success,
      danger
    });
  });
});

/**
* @method: get 
* @access: /expensesAndBudget/expenses/delete/id
* @private: now accountant
* @description: delete expenses
*/
router.get('/expenses/delete/:id', auth, (req, res) => {
  Expenses.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(`Unable to delete expenses: ${err}`);
    }
    req.flash('success', 'delete successful');
    res.redirect('/expensesAndBudget/expenses/display');
  });
});

/** 
 * BUDGET START
*/

/**
* @method: get 
* @access: /expensesAndBudget/budget/create
* @private: now accountant
* @description: create budget
*/
router.post('/budget/create', (req, res) => {
  if (req.body.budget_id === '') {
    addBudget(req, res);
  }
});

/**
* @method: get 
* @access: /expensesAndBudget/budget/create
* @private: now accountant
* @description: create budget
*/
function addBudget(req, res) {
  const { category_name, brand_name, budget_amount, other_budget } = req.body;
  const newBudget = new Budget({
    category_name,
    brand_name,
    budget_amount,
    other_budget
  });
  newBudget.save()
    .then(() => {
      req.flash('success', 'save successful');
      res.redirect('/expensesAndBudget/budget/display');
    })
    .catch(err => console.log(err));
}

/**
* @method: get 
* @access: /expensesAndBudget/budget/display
* @private: now accountant
* @description: display budget
*/
router.get('/budget/display', auth, (req, res) => {
  const success = req.flash('success');
  const danger = req.flash('danger');
  Budget.find({}).sort({ createdAt: -1 }).exec((err, budget) => {
    if (err) throw err;
    res.render('expensesAndBudget/budgetDisplay', {
      budget,
      success,
      danger
    });
  });
});

module.exports = router;
