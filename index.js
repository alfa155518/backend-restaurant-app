const mongoose = require('mongoose');

const express = require('express');

const cors = require('cors');

const path = require('path');

const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');

const rateLimit = require('express-rate-limit');

const app = express();

// env file
require('dotenv').config();

// Use Helmet!
app.use(helmet());

app.use(express.json());

// Serving static Fils
app.use(express.static(path.join(__dirname, 'images')));

// To Anabel LocalHost
app.use(cors());
// User Routes
const userRoute = require('./routes/userRoutes');

// All Products Routes
const allProductsRoute = require('./routes/allProductsRoutes');

// Popular Products Routes
const popularProductsRoute = require('./routes/popularProductsRoutes');

// Employees Routes
const employeesRoute = require('./routes/employeesRoutes');

// Reviews Routes
const reviewsRoute = require('./routes/reviewsRoutes');

// Tables Routes
const tablesRoute = require('./routes/tablesRoutes');

// Contact Routes
const contactRoute = require('./routes/contactRoutes');

// Admin Routes
const adminRoute = require('./routes/adminRoutes');

// Orders Routes
const orderRoute = require('./routes/ordersRoutes');

// Reservation Routes
const reserveRoute = require('./routes/reserveTableRoutes');

// Checkout Routes
const checkoutRoute = require('./routes/paymentRoutes');

// Connect To Database
mongoose.connect(process.env.DATABASE).then(() => {
  console.log('Database Connected');
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// To Protect injection
app.use(mongoSanitize());

// To Limit request
app.use(limiter);

// To Handel Global Errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Internal Server Error' });
});

// User Routes Middleware
app.use('/api/v1/users', userRoute);

// Products Routes Middleware
app.use('/api/v1/allProducts', allProductsRoute);

// popularProducts Routes Middleware
app.use('/api/v1/popularProducts', popularProductsRoute);

// Employees Routes Middleware
app.use('/api/v1/employees', employeesRoute);

// Employees Routes Middleware
app.use('/api/v1/reviews', reviewsRoute);

// Tables Routes Middleware
app.use('/api/v1/tables', tablesRoute);

// Contact Routes Middleware
app.use('/api/v1/contact', contactRoute);

// Admin Routes Middleware
app.use('/api/v1/admin', adminRoute);

// Orders Routes Middleware
app.use('/api/v1/orders', orderRoute);

// reserve Routes Middleware
app.use('/api/v1/reservation', reserveRoute);

// checkout Routes Middleware
app.use('/api/v1/payment', checkoutRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
