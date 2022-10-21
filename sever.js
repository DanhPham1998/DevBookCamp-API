const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors'); // Tạo màu console.log
require('dotenv').config({ path: './config/.env' }); //Config nhanh dotenv

// Router import file
const bookcampRouter = require('./routes/bookcampRoutes');

const app = express();

// Dev logger URL
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Conect to database
connectDB();

// Router
app.use('/api/v1/bookcamps', bookcampRouter);

PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Sever running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Bắt lỗi DB
process.on('unhandledRejection', (err, promise) => {
  console.log(`ERROR:${err.message}`.red.bold);
  // Close server and exit process
  server.close(() => process.exit(1));
});
