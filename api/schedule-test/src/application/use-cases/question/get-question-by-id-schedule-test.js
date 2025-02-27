const Joi = require("joi");
const Error = require("../../../frameworks/helpers/app-error");
const _ = require("lodash");
const paginate = require("../../../frameworks/helpers/resource-pagination");

const validate = (params) => {
  const schema = Joi.object({
    scheduleId: Joi.number().invalid(":scheduleId"),
    page: Joi.number(),
    limit: Joi.number().max(10000),
  });

  const validator = schema.validate(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};

const getQuestionByIdScheduleTest = async (repositories, params) => {
  const { questionRepository, apiRepository } = repositories;
  const { questionBankApiRepository } = apiRepository;

  validate(params);
  const { scheduleId, page, limit } = params;
  const offset = (page - 1) * limit;

  let { rows: schedules, count: total } =
    await questionRepository.getQuestionByIdScheduleId({
      scheduleId,
      offset,
      limit,
    });
  if (!schedules) throw new Error("Data not found.", 404);

  const questionIds = _.map(schedules, "questionId");

  let data = await questionBankApiRepository.getQuestionByIds({
    ids: questionIds,
  });

  const questionsData = [];
  schedules.forEach((schedule) => {
    data.forEach((question) => {
      if (schedule.questionId === question.id) {
        questionsData.push(question);
      }
    });
  });

  return paginate(page, limit, total, questionsData);
};

module.exports = getQuestionByIdScheduleTest;
