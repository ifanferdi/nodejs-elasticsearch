const scheduleEvent = require("./schedule-event");

module.exports = async (repositories, helpers, meilisearch, useCases) => {
  /*===================================================DEFINE========================================================== */
  const eventSchedule = await scheduleEvent(
    repositories,
    helpers,
    meilisearch,
    useCases
  );

  /*===================================================LISTENING EVENT========================================================== */
  await eventSchedule.createSchedule();
  await eventSchedule.updateSchedule();
  await eventSchedule.deleteSchedule();
};
