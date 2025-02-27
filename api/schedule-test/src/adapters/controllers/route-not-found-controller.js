const AppError = require("../../frameworks/helpers/app-error");

const routeNotFoundController = (req, res, next) => {
  next(new AppError(`url not found [${req.method}]`, 404));
};

module.exports = routeNotFoundController;
