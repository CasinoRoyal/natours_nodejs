const AppError = require('../utils/app-error');

const errorDevEnv = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      errObj: err
    });
  };

  return res.status(err.statusCode).render('error', {
    title: 'Page not found',
    msg: err.message
  });
};

const errorProdEnv = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (!err.isOperational) {
      console.error('Error', err);

      return res.status(500).json({
        status: 'error',
        message: 'Ctulhu is awakening. Run.'
      });
    };

    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  };

  if (!err.isOperational) {
      console.error('Error', err);

      return res.status(500).render('error', {
        tourTitle: 'Error',
        msg: 'Please, try again later'
      });
    };

  return res.status(err.statusCode).render('error', {
    tourTitle: 'Error',
    msg: err.message
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  
  return new AppError(message, 400);
};

const handleDublicateErrorDB = (err) => {
  const value = err.errmsg.match(/"([^"]+)"/)[0];  
  const message = `This name ${value} is already use`;

  return new AppError(message, 400);
};

const handleValidateErrorDB = (err) => {
  const errorMessages = Object.values(err.errors).map((el) => el.message);
  return new AppError(errorMessages.join('. '), 400);
};

const handleJWTError = () => new AppError('Invalid token', 401);

const handleJWTExpireError = () => new AppError('Token was expired. Please log in.', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    errorDevEnv(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDublicateErrorDB(error);
    if (error.name === 'ValidationError') error = handleValidateErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpireError();

    errorProdEnv(error, req, res);
  };
};