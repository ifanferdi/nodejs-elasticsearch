const config = require("../../../../config/config");
const exchange = config.rabbitmq.scheduleTestExchange;
const deleteQueueScheduleTest = async (repositories, schedules) => {
  const { rabbitMqRepository } = repositories;

  const payload = [];
  for (const schedule of schedules) {
    payload.push(Number(schedule.id));
  }
  await rabbitMqRepository.publishQueue(
    "ba.registration:delete",
    exchange,
    payload
  );

  // await rabbitMqRepository.subscribeQueue(
  //   "ba.registration:delete",
  //   exchange,
  //   (result) => {
  //     console.log(result);
  //   }
  // );
};

module.exports = deleteQueueScheduleTest;
