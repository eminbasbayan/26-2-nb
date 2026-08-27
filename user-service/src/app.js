const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const internalRoutes = require('./routes/internalRoutes');

const app = express();
app.set('trust proxy', 1);
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(cookieParser());

app.get('/health', (req, res) => res.status(200).json({ service: 'user-service', status: 'ok' }));
app.use(
  '/api/auth',
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false }),
  authRoutes,
);
app.use('/api/users', userRoutes);
app.use('/internal', internalRoutes);

app.use((req, res) => res.status(404).json({ message: 'Page not found!' }));
app.use((error, req, res, next) => res.status(500).json({ message: error.message }));

module.exports = app;
