const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tour-routers');
const userRouter = require('./routes/user-routers');
const reviewRouter = require('./routes/review-routes');
const viewRouter = require('./routes/view-routes');
const AppError = require('./utils/app-error');
const handleError = require('./controllers/error-controller');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
};

const apiLimiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000
});
app.use('/api/', apiLimiter);

app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitize());

app.use(xss());

app.use(hpp({
  whitelist: [
    'duration',
    'price',
    'difficulty',
    'maxGroupSize',
    'ratingsAverage'
  ]
}));

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  const message = `We can't find ${req.originalUrl}. Sorry :(`;
  
  next(new AppError(message, 404));
});

app.use(handleError);

module.exports = app;