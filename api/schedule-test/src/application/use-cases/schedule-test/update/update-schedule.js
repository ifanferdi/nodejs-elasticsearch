const Joi = require("joi");
const Error = require("../../../../frameworks/helpers/app-error");
const _ = require("lodash");

const validate = async (params) => {
  const schema = Joi.object({
    id: Joi.number().required().max(9223372036854775807),
    date: Joi.date().required(),
    classroomId: Joi.number(),
    batchId: Joi.number(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required().greater(Joi.ref("startTime")),
    type: Joi.string()
      .required()
      .valid("Kuis", "Ujian", "Ujian Masuk", "Seleksi Kelas"),
    desc: Joi.string().required().max(1000),
  });

  const validator = await schema.validateAsync(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};

const updateScheduleTest = async (repositories, params) => {
  const { scheduleTestRepository, questionServedRepository } = repositories;

  let updateData = [];
  for (const param of params) {
    param.startTime = new Date(`${param.date} ${param.startTime}`);
    param.endTime = new Date(`${param.date} ${param.endTime}`);

    // validator
    const { id, date, classroomId, batchId, startTime, endTime, type } = param;
    await validate({
      id,
      date,
      classroomId,
      batchId,
      startTime,
      endTime,
      type,
      desc: param.sessionDescription,
    });

    const duration = Math.abs(param.endTime - param.startTime) / 1000 / 60;

    const schedule = await scheduleTestRepository.findOneByIdSession(param.id);
    if (!schedule) throw new Error("Data not found.", 404);

    // Update schedule data
    const update = await scheduleTestRepository.updateScheduleBySessionId(
      {
        date,
        startTime: param.startTime.toLocaleTimeString(),
        endTime: param.endTime.toLocaleTimeString(),
        type: ["Ujian", "Ujian Masuk", "Seleksi Kelas"].includes(param.type)
          ? "Ujian"
          : "Kuis",
        desc: param.sessionDescription,
        token: null,
        duration,
      },
      param.id,
    );
    updateData.push(update[1][0]);

    if (duration < schedule.duration) {
      await questionServedRepository.updateByScheduleIdQuestionServed(
        { duration: null },
        { scheduleId: schedule.id },
      );
    }
  }

  // Deleting question serve
  const scheduleIds = _.map(updateData, (data) => {
    return data.id;
  });
  await questionServedRepository.bulkDeleteQuestionServedByScheduleId(
    scheduleIds,
  );

  return updateData;
};

module.exports = updateScheduleTest;
