const _ = require("lodash");
module.exports = {
  onHook: (span, hookInfo) => {
    try {
      const messages = hookInfo.payload;
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        span.setAttribute(
          `messages.arg.${i + 1}`,
          message instanceof Object ? JSON.stringify(message) : message
        );
      }
    } catch (error) {}
  },
  emitHook: (span, hookInfo) => {
    try {
      const messages = hookInfo.payload;
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        span.setAttribute(
          `messages.arg.${i + 1}`,
          message instanceof Object ? JSON.stringify(message) : message
        );
      }
    } catch (error) {}
  },
};
