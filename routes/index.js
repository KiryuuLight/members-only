const { authenticateValidation, redirectIsLogged } = require('../config/auth');
const { checkSchema, validationResult } = require('express-validator');
const { messageSchema } = require('../validations/messageValidate');
const { userSchema } = require('../validations/userValidate');
const bcrypt = require('bcryptjs');
const express = require('express');
const Message = require('../models/message');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');

// Home page
router.get('/', async function (req, res, next) {
  const userMessages = await Message.find().populate('user').exec();

  console.log(userMessages);

  res.render('index', { userMessages });
});

// Sign Up

router.get('/sign-up', redirectIsLogged, (req, res) => {
  res.render('sign-up');
});

router.post('/sign-up', checkSchema(userSchema), async (req, res) => {
  const errors = validationResult(req);

  console.log(errors);

  if (!errors.isEmpty()) {
    res.render('sign-up', { errors: errors.array() });
    return;
  }

  const password = req.body.password;

  bcrypt.hash(password, 10, async (error, passwordHashed) => {
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: passwordHashed,
    });

    await newUser.save();
  });

  req.flash('success_msg', 'Account Successfully Created ');
  res.redirect('/login');
});

// Login

router.get('/login', redirectIsLogged, (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Dashboard

router.get('/dashboard', authenticateValidation, (req, res) => {
  res.render('dashboard');
});

// Secret

router.get('/join-us', authenticateValidation, (req, res) => {
  res.render('join-us');
});

router.post('/join-us', authenticateValidation, async (req, res) => {
  if (req.body.secret === process.env.SECRET_CODE) {
    await User.findByIdAndUpdate(req.user._id, { memberStatus: true }).exec();
    req.flash(
      'success_msg',
      'Code correctly entered , now you can create messages!'
    );
    return res.redirect('/create-message');
  }

  req.flash('error_msg', 'Invalid Code');
  res.redirect('/join-us');
});

// Become Admin

router.get('/become-admin', authenticateValidation, (req, res) => {
  res.render('become-admin');
});

router.post('/become-admin', authenticateValidation, async (req, res) => {
  if (req.body.secret === process.env.ADMIN_CODE) {
    await User.findByIdAndUpdate(req.user._id, { admin: true }).exec();
    req.flash('success_msg', 'Code correctly entered , now you are an admin!');
    return res.redirect('/');
  }

  req.flash('error_msg', 'Invalid Code');
  res.redirect('/become-admin');
});

// New message

router.get('/create-message', authenticateValidation, (req, res) => {
  res.render('create-message');
});

router.post(
  '/create-message',
  authenticateValidation,
  checkSchema(messageSchema),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('create-message', { errors: errors.array() });
    }

    const message = new Message({
      title: req.body.title,
      bodyMessage: req.body.bodyMessage,
      user: req.user._id,
    });

    await message.save();
    req.flash('success_msg', 'Message successfully created');
    res.redirect('/');
  }
);

// Delete Message

router.post('/delete-message', async (req, res) => {
  await Message.findByIdAndDelete(req.body.id).exec();
  req.flash('success_msg', 'Message successfully deleted');
  res.redirect('/');
});

// Logout

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success_msg', 'You Successfully logout');
    res.redirect('/login');
  });
});

module.exports = router;
