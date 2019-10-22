const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tour-routers');
const userRouter = require('./routes/user-routers');
const AppError = require('./utils/app-error');
const handleError = require('./controllers/error-controller');

const app = express();

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
};

app.use(express.json());

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  const message = `We can't find ${req.originalUrl}. Sorry :(`;
  
  next(new AppError(message, 404));
});

app.use(handleError);

module.exports = app;