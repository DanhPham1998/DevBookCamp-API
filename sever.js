const express = require('express');
const path = require('path');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors'); // Tạo màu console.log
const globalErrorHandle = require('./middleware/handlerError');
const cookieParser = require('cookie-parser');

// Security Web
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

require('dotenv').config({ path: './config/.env' }); //Config nhanh dotenv

// Router import file
const bookcampRouter = require('./routes/bookcampRoutes');
const courseRouter = require('./routes/courseRoutes');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// Dev logger URL
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json({ limit: '10kb' }));

// Cookie Parser
app.use(cookieParser());

// Tránh SQL injection
app.use(mongoSanitize());

// Set Dns và giấu ip, lọc header
app.use(helmet());

// Tránh chèn dữ liệu có code html js
app.use(xss());

// Lọc params
app.use(hpp());

// Rate limit request with 1 IP
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Conect to database
connectDB();

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Router
app.use('/api/v1/bootcamps', bookcampRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
