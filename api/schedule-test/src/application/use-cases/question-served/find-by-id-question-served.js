const Joi = require("joi");
const Error = require("../../../frameworks/helpers/app-error");
const _ = require("lodash");

const validate = (params) => {
  const schema = Joi.object({
    id: Joi.number().required(),
  });

  const validator = schema.validate(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};

const findByIdQuestionServed = async (repositories, fileSystem, params) => {
  const { questionServedRepository, apiRepository } = repositories;
  const { questionBankApiRepository } = apiRepository;

  const { id } = params;

  validate(params);

  const questionServed = await questionServedRepository.findByIdQuestionServed({
    id,
  });
  if (questionServed === null) throw new Error("Data not found.", 404);

  const questionIds = _.map(questionServed.questions, "questionId");
  const questions = await questionBankApiRepository.getQuestionByIds({
    ids: questionIds,
  });

  questionServed.questions.forEach((question) => {
    questions.forEach((question2) => {
      if (question.questionId === question2.id) {
        return _.assign(question, { question: question2 });
      }
    });
  });

  questionServed.form.file = await fileSystem.getUrl(questionServed.form.file);

  return questionServed;
};

module.exports = findByIdQuestionServed;
