function asyncHandler(controllerFunction) {
  return function (req, res, next) {
    Promise.resolve(controllerFunction(req, res, next)).catch(next);
  };
}

export default asyncHandler;
