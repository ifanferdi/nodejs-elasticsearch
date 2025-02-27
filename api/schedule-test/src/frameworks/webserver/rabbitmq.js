const amqp = require("amqplib");

module.exports = async (config) => {
  const connection = await amqp.connect(config.rabbitmq.host);
  return await connection.createChannel().catch((err) => {
    throw err;
  });
};
