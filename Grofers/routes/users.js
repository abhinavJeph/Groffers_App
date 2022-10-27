const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');
const userController = require("../controllers/users_controller");
// const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', (req, res) => res.render('../views/login'));

// Register Page
router.get('/register', (req, res) => res.render('../views/register.ejs'));

// Register
router.post('/register', userController.register);

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/user/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/user/login');
});

router.get('/referral', ensureAuthenticated, userController.getReferral);
router.get('/referral/history', ensureAuthenticated, userController.getRefferalHistory);
router.get('/referral/milestone', ensureAuthenticated, userController.getMilestoneInfo);



router.post('/', ensureAuthenticated, userController.updateStatus);

module.exports = router;