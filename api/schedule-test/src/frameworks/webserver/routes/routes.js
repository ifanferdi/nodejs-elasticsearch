const formTestRoute = require("./form-routes");
const scheduleRoute = require("./schedule-test-routes");
const questionServedRoute = require("./question-served-routes");
const questionRoute = require("./question-routes");
const elasticsearchRoute = require("./elasticsearch-routes");
const routeNotFoundController = require("../../../adapters/controllers/route-not-found-controller");
const config = require("../../../config/config");

const routes = async (app, controllers) => {
  // Route
  app.use("/api/v1", formTestRoute(controllers));
  app.use("/api/v1", scheduleRoute(controllers));
  app.use("/api/v1", questionServedRoute(controllers));
  app.use("/api/v1", questionRoute(controllers));
  if (config.elasticsearch.enabled) app.use("/api/v1", elasticsearchRoute(controllers));

  app.all("*", routeNotFoundController);

  return app;
};

module.exports = routes;
