const { v4: uuidv4 } = require("uuid");

/**
 *
 * @param {*} cache Redis Connection
 * @param {*} channel channel From RabbitMQ
 * @returns
 */
const delayTrustQueue = (cache, channel) => {
  const prefixKeyTrust = "mq_trustkey:";

  // use this as callback for consume mq messages that
  function delayTrustConsume(queueName, keyTrust, cb) {
    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        let messageId = msg.properties.messageId;

        // check if message are trust or last message
        if ((await cache.get(prefixKeyTrust + keyTrust)) === messageId)
          cb(msg.content.toString());

        channel.ack(msg);
      }
    });
  }

  async function delayTrustPublish(exchange, queueName, keyTrust, delay, data) {
    let uuid = uuidv4();

    const publish = channel.publish(exchange, queueName, Buffer.from(data), {
      headers: { "x-delay": delay },
      messageId: uuid,
    });

    await cache.set(prefixKeyTrust + keyTrust, uuid);

    return publish;
  }

  async function revokeKeyTrust(keyTrust) {
    cache.del(prefixKeyTrust + keyTrust);
  }

  return { delayTrustConsume, delayTrustPublish, revokeKeyTrust };
};
module.exports = delayTrustQueue;
