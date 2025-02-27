const RabbitMqRepository = (channel, helpers) => {
  const { rabbitHelper } = helpers;

  const publishQueue = async (key, exchange, params) => {
    try {
      channel.assertExchange(exchange, "x-delayed-message", {
        durable: true,
        arguments: { "x-delayed-type": "direct" },
      });

      const publish = channel.publish(
        exchange,
        key,
        Buffer.from(JSON.stringify(params)),
        { persistent: true }
      );

      if (publish === true)
        console.log(
          `------------------------------------ \n Success create event to ${exchange} exchange: ${JSON.stringify(
            params
          )}`
        );
    } catch (error) {
      console.log(error);
    }
  };

  const publishUniqueQueue = async (key, exchange, params, timer, keyTrust) => {
    try {
      channel.assertExchange(exchange, "x-delayed-message", {
        durable: true,
        arguments: { "x-delayed-type": "direct" },
      });

      const publish = await rabbitHelper.delayTrustPublish(
        exchange,
        key,
        keyTrust,
        timer,
        JSON.stringify(params)
      );

      if (publish === true)
        console.log(
          `------------------------------------ \n Success create event to ${exchange} exchange: ${JSON.stringify(
            params
          )}, with timer: ${timer / 1000} ms`
        );
    } catch (error) {
      console.log(error);
    }
  };

  const subscribeUniqueQueue = async (key, exchange, keyTrust) => {
    channel.assertExchange(exchange, "x-delayed-message", {
      durable: true,
      arguments: { "x-delayed-type": "direct" },
    });

    const { queue } = await channel.assertQueue(key, { exclusive: false });

    channel.bindQueue(queue, exchange, key);

    rabbitHelper.delayTrustConsume(key, keyTrust, async (value) => {
      console.log("halo" + (await value));
    });
  };

  const subscribeQueue = async (key, exchange, cb) => {
    channel.assertExchange(exchange, "x-delayed-message", {
      durable: true,
      arguments: { "x-delayed-type": "direct" },
    });

    const { queue } = await channel.assertQueue(key, { exclusive: false });

    channel.bindQueue(queue, exchange, key);

    let data;
    await channel.consume(queue, (value) => {
      data = JSON.parse(value.content.toString());
      cb(data);
      channel.ack(value);
    });
  };

  const deleteCacheKey = async (keyTrust) => {
    await rabbitHelper.revokeKeyTrust(keyTrust);
  };

  return {
    publishUniqueQueue,
    publishQueue,
    subscribeUniqueQueue,
    subscribeQueue,
    deleteCacheKey,
  };
};

module.exports = RabbitMqRepository;
