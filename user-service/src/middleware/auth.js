const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');

const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = req.cookies?.accessToken ||
    (authorization?.startsWith('Bearer ') ? authorization.slice(7) : null);

  if (!token) {
    return res.status(403).json({ message: 'Token gerekli' });
  }

  try {
    req.user = jwt.verify(token, secret);
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Geçersiz token' });
  }
};

module.exports = { verifyToken };
