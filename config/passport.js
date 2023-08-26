const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
// Load User Model
const User = require('../models/user');

const passportConfig = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        const userExist = await User.findOne({ email });

        if (!userExist)
          return done(null, false, { message: `User doesn't exist` });

        const passwordMatch = await bcrypt.compare(
          password,
          userExist.password
        );

        if (!passwordMatch)
          return done(null, false, { message: 'Invalid password' });

        return done(null, userExist);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).exec();
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

module.exports = passportConfig;
