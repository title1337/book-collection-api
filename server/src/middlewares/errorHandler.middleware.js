function errorHandlerMiddleware(error, req, res, next) {
  const isOperationalError = error.isOperational === true;

  if (isOperationalError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  console.error('[Unexpected Error]', error);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}

export default errorHandlerMiddleware;
