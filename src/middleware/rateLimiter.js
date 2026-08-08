const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Çok fazla giriş/kayıt denemesi. Lütfen 15 dakika sonra tekrar deneyin.',
  },
});

module.exports = {
  globalLimiter,
  authLimiter,
};
