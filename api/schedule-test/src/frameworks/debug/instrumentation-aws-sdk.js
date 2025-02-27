module.exports = {
  responseHook: (span, { response }) => {
    try {
      delete response?.request?.commandInput?.Body;
      span.setAttribute(`aws.data`, JSON.stringify(response?.data));
      span.setAttribute(`aws.request`, JSON.stringify(response?.request));
    } catch (error) {}
  },
};
