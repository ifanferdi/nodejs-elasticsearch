module.exports = {
  dbStatementSerializer: function (cmdName, cmdArgs) {
    try {
      // return [cmdName, ...cmdArgs].join(' ')
    } catch (error) {}
  },
  responseHook: function (span, cmdName, cmdArgs, response) {
    try {
      span.setAttribute(`cmd.name`, JSON.stringify(cmdName));
      span.setAttribute(`redis.key`, cmdArgs[0]);
      span.setAttribute(
        `redis.value`,
        response != "OK" ? response : cmdArgs[1]
      );
    } catch (error) {}
  },
  // requireParentSpan: true // Require parent to create redis span, default when unset is false.
};
