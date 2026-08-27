const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
app.set('trust proxy', 1);
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(cookieParser());

app.get('/health', (req, res) => res.status(200).json({ service: 'order-service', status: 'ok' }));
app.use('/api/payments', paymentRoutes);
app.use((req, res) => res.status(404).json({ message: 'Page not found!' }));
app.use((error, req, res, next) => res.status(500).json({ message: error.message }));

module.exports = app;
