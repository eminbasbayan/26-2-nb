const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = req.cookies?.accessToken ||
    (authorization?.startsWith('Bearer ') ? authorization.slice(7) : null);

  if (!token) return res.status(403).json({ message: 'Token gerekli' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Geçersiz token' });
  }
};

module.exports = { verifyToken };
