const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors'); // Tạo màu console.log
const globalErrorHandle = require('./middleware/handlerError');
require('dotenv').config({ path: './config/.env' }); //Config nhanh dotenv

// Router import file
const bookcampRouter = require('./routes/bookcampRoutes');
const courseRouter = require('./routes/courseRoutes');
const { json } = require('express');

const app = express();

// Body parser
app.use(express.json({ limit: '10kb' }));

// Dev logger URL
//if (process.env.NODE_ENV === 'development') {
app.use(morgan('dev'));
//}

// Conect to database
connectDB();

// Router
app.use('/api/v1/bootcamps', bookcampRouter);
app.use('/api/v1/courses', courseRouter);

// Global Error Handle
app.use(globalErrorHandle);

PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Sever running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

//Bắt lỗi DB
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
