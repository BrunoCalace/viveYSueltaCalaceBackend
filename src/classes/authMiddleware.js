export function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
      next();
    } else {
      res.redirect('/');
    }
}

export function isAdmin(req, res, next) {
  if (req.session && req.session.userRole === 'admin') {
      next();
  } else {
      res.redirect('/products');
  }
}
  
export function isNotAuthenticated(req, res, next) {
    if (!req.session || !req.session.userId) {
      next();
    } else {
      res.redirect('/profile');
    }
}