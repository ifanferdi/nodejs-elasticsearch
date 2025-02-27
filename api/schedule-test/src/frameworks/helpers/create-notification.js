const createNotification = async (repositories, config, params) => {
  const { rabbitMqRepository } = repositories;
  const { user_ids, provider, data } = params;

  await rabbitMqRepository.publishQueue(
    "notif:create",
    config.rabbitmq.notification_exchange,
    {
      user_ids: user_ids,
      provider: provider,
      data: data,
      institute: config.institute,
      app: config.app,
    },
  );
};

module.exports = createNotification;
