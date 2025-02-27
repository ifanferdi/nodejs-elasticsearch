module.exports = {
  publishHook: (span, publishInfo) => {
    try {
      const message = publishInfo?.content?.toString();
      span.setAttribute(`messaging.content`, message);
      span.setAttribute(
        `messaging.options`,
        JSON.stringify(publishInfo?.options)
      );
      span.setAttribute(
        `messaging.is_confirm_channel`,
        publishInfo?.isConfirmChannel
      );
    } catch (error) {}
  },
  consumeHook: (span, consumeInfo) => {
    try {
      const message = consumeInfo?.msg?.content?.toString();
      span.setAttribute(`messaging.content`, message);
      span.setAttribute(
        `messaging.fields`,
        JSON.stringify(consumeInfo?.msg?.fields)
      );
      span.setAttribute(
        `messaging.properties`,
        JSON.stringify(consumeInfo?.msg?.properties)
      );
    } catch (error) {}
  },
};
