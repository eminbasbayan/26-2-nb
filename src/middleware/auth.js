const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwtConfig");

const verifyToken = (req, res, next) => {
  const token =  req.cookies?.accessToken ||
  (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(403).json({ message: 'Token gerekli' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Geçersiz token' });
  }
};

module.exports = { verifyToken };
