module.exports = {
  isLogin(req, res, next) {
    if (req.session.loggedin === true) {
      next();
      return;
    } else {
      req.session.destroy(function(err) {
        res.redirect('/login');
      })
    }
  },
  isLogout(req, res, next) {
    if (req.session.loggedin !== true) {
      next();
      return;
    }
    res.redirect('/');
  }
};