import jwt from 'jsonwebtoken'

export function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Acceso no autorizado' });

  jwt.verify(token, 'tu_secreto_secreto', (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });

    req.user = user;
    next();
  });
};

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

export function isPremium(req, res, next) {
  if (req.session && req.session.userRole === 'premium') {
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