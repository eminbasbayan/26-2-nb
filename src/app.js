const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.js');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const { globalLimiter, authLimiter } = require('./middleware/rateLimiter');
const corsOptions = require('./config/corsConfig');
const userRoutes = require('./routes/userRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes.js');

const app = express();

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(logger);
app.use(globalLimiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(cookieParser());
// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res) => {
  res.status(404).send('Page not found!');
});

app.use(errorHandler);

module.exports = app;
