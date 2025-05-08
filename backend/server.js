const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Enable CORS for frontend
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Logging during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
const auth = require('./routes/auth');
const professors = require('./routes/professors');
const reviews = require('./routes/reviews');

app.use('/api/auth', auth);
app.use('/api/professors', professors);
app.use('/api/reviews', reviews);

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  () => console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Graceful shutdown on unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
