const config = require("../../../../config/config");
const exchange = config.rabbitmq.scheduleTestExchange;
const deleteQueueScheduleTest = async (repositories, schedules) => {
  const { rabbitMqRepository } = repositories;

  for (const schedule of schedules) {
    await rabbitMqRepository.publishQueue("ba.schedule.test:delete", exchange, {
      scheduleId: Number(schedule.id),
    });
    await rabbitMqRepository.deleteCacheKey(
      `ba_schedule_test_create:${schedule.id}`
    );
    // await rabbitMqRepository.subscribeQueue(
    //   "ba.schedule.test:delete",
    //   exchange
    // );
  }
};

module.exports = deleteQueueScheduleTest;
