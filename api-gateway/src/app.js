const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const publicDirectory = path.join(__dirname, 'public');

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set('trust proxy', 1);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS politikası tarafından engellendiniz.'));
    },
    credentials: true,
  }),
);
app.use(morgan('dev'));
app.use(express.static(publicDirectory));

app.get('/health', (req, res) => {
  res.status(200).json({ service: 'api-gateway', status: 'ok' });
});

app.get('/payment/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'payment-success.html'));
});

app.get('/payment/fail', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'payment-fail.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDirectory, 'index.html'));
});

const createServiceProxy = (target) =>
  createProxyMiddleware({
    target,
    changeOrigin: false,
    xfwd: true,
    proxyTimeout: 10000,
    timeout: 15000,
    on: {
      error(error, req, res) {
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
        }
        res.end(JSON.stringify({ message: 'Hedef servise ulaşılamadı' }));
      },
    },
  });

const userProxy = createServiceProxy(
  process.env.USER_SERVICE_URL || 'http://user-service:3001',
);
const catalogProxy = createServiceProxy(
  process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002',
);
const orderProxy = createServiceProxy(
  process.env.ORDER_SERVICE_URL || 'http://order-service:3003',
);

app.use((req, res, next) => {
  if (req.path.startsWith('/api/auth') || req.path.startsWith('/api/users')) {
    return userProxy(req, res, next);
  }
  if (
    req.path.startsWith('/api/products') ||
    req.path.startsWith('/api/categories')
  ) {
    return catalogProxy(req, res, next);
  }
  if (req.path.startsWith('/api/payments')) {
    return orderProxy(req, res, next);
  }
  return next();
});

app.use((req, res) => {
  res.status(404).json({ message: 'Page not found!' });
});

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

module.exports = app;
