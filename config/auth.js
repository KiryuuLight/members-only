const redirectIsLogged = (req, res, next) => {
  if (typeof req.user !== 'undefined') {
    return res.redirect('/');
  }
  next();
};

const authenticateValidation = (req, res, next) => {
  if (typeof req.user === 'undefined') {
    return res.redirect('/login');
  }
  next();
};

module.exports = { redirectIsLogged, authenticateValidation };
