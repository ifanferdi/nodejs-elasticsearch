const Sentry = require("@sentry/node");

module.exports = (app, config) => {
  const beforeControllers = () => {
    Sentry.init({
      dsn: config?.sentry?.dsn,
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({
          // to trace all requests to the default router
          app,
          // alternatively, you can specify the routes you want to trace:
          // router: someRouter,
        }),
      ],

      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 1.0,

      //to enable -> Sentry Logger [log]
      // debug: true
    });
    // The request handler must be the first middleware on the app
    app.use(Sentry.Handlers.requestHandler());

    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler());
  };

  const afterControllers = () => {
    // The error handler must be before any other error middleware and after all controllers
    app.use(Sentry.Handlers.errorHandler());

    // Optional fallthrough error handler
    app.use(function onError(err, req, res, next) {
      // The error id is attached to `res.sentry` to be returned
      // and optionally displayed to the user for support.
      res.statusCode = err.statCode || 500;
      let data = { message: err?.message };
      if (config?.nodeEnv === "development") {
        data = { ...data, sentry: res?.sentry ?? null, stack: err?.stack };
      }
      return res.json(data);
    });
  };

  return { beforeControllers, afterControllers };
};
