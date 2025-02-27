const Joi = require("joi");
const Error = require("../../../../frameworks/helpers/app-error");
const _ = require("lodash");

const validate = (params) => {
  const schema = Joi.object({
    id: Joi.number().invalid(":id"),
  });

  const validator = schema.validate(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};

const findByIdScheduleTest = async (repositories, params) => {
  const { scheduleTestRepository, apiRepository } = repositories;

  validate(params);
  const { id } = params;
  const { courseApiRepository, scheduleApiRepository } = apiRepository;

  let schedule = await scheduleTestRepository.findByIdSchedule(id, ["form"]);
  if (!schedule) throw new Error("Data not found.", 404);

  schedule.session = await scheduleApiRepository.findByIdSession(Number(schedule.sessionId));

  schedule.typeCategory =
    schedule?.session?.category === "Kuis" || schedule?.session?.category === "kuis"
      ? `${schedule?.type}`
      : `${schedule?.type} (${schedule?.session?.category})`;

  let totalQuestions = 0;
  schedule.questionServeds.forEach((section) => {
    totalQuestions += section.amount;
  });
  schedule.totalQuestions = totalQuestions;

  return {
    ..._.omit(schedule.dataValues, ["questionServeds", "session", "typeCategory", "totalQuestions", "course"]),
    typeCategory: schedule.typeCategory,
    totalQuestions: schedule.totalQuestions,
    questionServeds: schedule.questionServeds,
    session: schedule.session,
    course: schedule.course,
  };
};

module.exports = findByIdScheduleTest;
