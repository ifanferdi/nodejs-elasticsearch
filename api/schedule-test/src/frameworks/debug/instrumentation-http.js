const _ = require("lodash");
module.exports = {
  applyCustomAttributesOnSpan: (span, response) => {
    try {
      delete response?.file?.buffer;
      span.setAttribute(`http.res.headers`, JSON.stringify(response?.headers));
      span.setAttribute(`http.res.file`, JSON.stringify(response?.file));
      span.setAttribute(
        `http.res.files`,
        JSON.stringify(
          _.map(response?.files, (file) => {
            delete file?.buffer;
            return file;
          })
        )
      );
      span.setAttribute(`http.res.body`, JSON.stringify(response?.body));
      span.setAttribute(`http.res.params`, JSON.stringify(response?.params));
      span.setAttribute(`http.res.query`, JSON.stringify(response?.query));
    } catch (error) {}
  },
  ignoreOutgoingRequestHook: (request) => request.path.includes("sentry_key"),
};
