const validate = require("./create-request");

const bulkCreateScheduleTest = async (repositories, params) => {
  const { scheduleTestRepository } = repositories;

  const bulkCreateParams = [];
  for (const param of params) {
    let { batchId, id, date, startTime, endTime, type, sessionDescription } =
      param;
    const newStartTime = new Date(`${date} ${startTime}`);
    const newEndTime = new Date(`${date} ${endTime}`);

    // validator
    validate({
      batchId,
      id,
      date: date,
      startTime: newStartTime,
      endTime: newEndTime,
      type,
      desc: sessionDescription,
    });

    const duration = Math.abs(newEndTime - newStartTime) / 1000 / 60; // duration = minute

    bulkCreateParams.push({
      batchId,
      sessionId: id,
      date: date,
      startTime: newStartTime.toLocaleTimeString(),
      endTime: newEndTime.toLocaleTimeString(),
      duration,
      type:
        type === "Ujian" ||
        type === "Ujian Masuk" ||
        type === "Seleksi Kelas"
          ? "Ujian"
          : "Kuis",
      desc: sessionDescription,
    });
  }

  return scheduleTestRepository.bulkCreateSchedule(bulkCreateParams);
};

module.exports = bulkCreateScheduleTest;
