const AppError = require('../utils/app-error');

const errorDevEnv = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    errObj: err
  });
};

const errorProdEnv = (err, res) => {
  if (!err.isOperational) {
    console.error('Error', err);

    res.status(500).json({
      status: 'error',
      message: 'Ctulhu is awakening. Run.'
    });
  } else {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
  };
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
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    errorDevEnv(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDublicateErrorDB(error);
    if (error.name === 'ValidationError') error = handleValidateErrorDB(error);

    errorProdEnv(error, res);
  };
};