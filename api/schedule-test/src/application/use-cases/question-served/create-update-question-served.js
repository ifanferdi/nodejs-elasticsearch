const Joi = require("joi");
const Error = require("../../../frameworks/helpers/app-error");
const _ = require("lodash");
const findByIdSchedule = require("../schedule-test/get/find-by-id-schedule-test");

const validate = (params) => {
  let schema;
  schema = Joi.object().keys({
    scheduleId: Joi.number().required().invalid(":scheduleId"),
    body: Joi.array().items(
      Joi.object().keys({
        id: Joi.number().allow(null),
        formId: Joi.number().required(),
        duration: Joi.number().required().greater(0),
        randomize: Joi.bool().required().default("false"),
        levelDifficult: Joi.number().allow(null).valid(1, 2, 3, 4, 5),
        amount: Joi.number().required(),
      })
    ),
  });

  const validator = schema.validate(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};

const createOrUpdateQuestionServed = async (repositories, params) => {
  const { scheduleTestRepository, formRepository, questionServedRepository } =
    repositories;

  const { scheduleId, body } = params;

  const checkSchedule = await scheduleTestRepository.findByIdSchedule(
    scheduleId
  );
  if (!checkSchedule) throw new Error("Schedule not found.");

  // Tidak boleh edit penyajian soal jika jadwalnya sudah berjalan
  const { date, startTime } = checkSchedule;
  if (new Date(date + "T" + startTime) < new Date())
    throw new Error("Update Failed! This schedule has been started.");

  await checkerQuestionFormAndDifficult(params.body, formRepository);

  // check is question serve is already exist ?
  const checkQuestionServed =
    await questionServedRepository.getAllQuestionServed({
      scheduleId,
    });

  // validator
  validate({ scheduleId, body });

  // Check if all question serve duration > schedule duration
  if (_.sum(_.map(body, "duration")) > checkSchedule.duration)
    throw new Error(
      `Total duration cannot be grather than schedule duration (${checkSchedule.duration} minute).`
    );

  const bulkData = _.map(body, (element) => {
    return _.extend({}, element, { scheduleId: scheduleId });
  });

  let serveds = [];
  // if question serve === null ? create : update
  if (checkQuestionServed.length === 0) {
    const bulkCreate = await questionServedRepository.bulkCreateQuestionServed(
      bulkData
    );
    _.map(bulkCreate, (schedule) => {
      serveds.push(schedule);
    });
  } else {
    const bulkDeleteIds = deleteDataIds(bulkData, checkQuestionServed);

    // updating and deleting data using questionServedRepository
    await questionServedRepository.bulkDeleteQuestionServed(bulkDeleteIds);

    const createData = [];
    for (const param of bulkData) {
      // update old data
      if (param.id) {
        let update = await questionServedRepository.updateQuestionServed(
          {
            formId: param.formId,
            duration: param.duration,
            randomize: param.randomize,
            levelDifficult: param.levelDifficult,
            amount: param.amount,
          },
          param.id,
          scheduleId
        );
        update = update[1][0];
        serveds.push(update);
      } else {
        // create if has a new data
        createData.push(param);
      }
    }
    if (createData.length > 0) {
      const bulkCreate =
        await questionServedRepository.bulkCreateQuestionServed(createData);
      _.map(bulkCreate, (schedule) => {
        serveds.push(schedule);
      });
    }
  }

  await recreateQuestion(repositories, serveds);

  return { message: "Success." };
};

/**
 * Method to get an array id of deleted data
 * @param data
 * @param checkQuestionServed
 * @returns {number[]}
 */
const deleteDataIds = (data, checkQuestionServed) => {
  // select deleted object.
  const bulkDataIds = _.map(data, "id");
  const bulkUpdateIds = _.map(checkQuestionServed, (row) => {
    return Number(row.id);
  });

  return _.remove(bulkUpdateIds, (el) => !bulkDataIds.includes(el));
};

const recreateQuestion = async (repositories, serveds) => {
  const { questionRepository, formRepository, apiRepository } = repositories;
  const { questionBankApiRepository } = apiRepository;
  const scheduleTestId = _.uniq(_.map(serveds, "scheduleId"));
  const formIds = _.uniq(_.map(serveds, "formId"));

  const schedule = await findByIdSchedule(repositories, {
    id: Number(scheduleTestId[0]),
  });
  const forms = await formRepository.findAll(formIds);

  const randomizeParams = {
    courseId: schedule.courseId,
    subjectId: schedule.session.subjectId,
    testType: schedule.type,
    questions: [],
  };
  const serveIds = [];
  for (const serve of serveds) {
    forms.forEach((form) => {
      if (serve.formId === form.id) {
        serveIds.push(serve.id);
        randomizeParams.questions.push({
          questionServedId: Number(serve.id),
          questionForm: _.map(form.questionForm, "number"),
          difficulty: serve.levelDifficult,
          amount: serve.amount,
        });
      }
    });
  }

  const randomQuestions = await questionBankApiRepository.generateQuestion(
    randomizeParams
  );

  const createQuestions = [];
  _.map(randomQuestions, (questions, id) => {
    _.map(questions, (question) => {
      return createQuestions.push({
        questionServedId: id,
        questionId: question,
      });
    });
  });

  await questionRepository.bulkDeleteScheduleQuestion(serveIds);
  await questionRepository.bulkCreateScheduleQuestion(createQuestions);
};

const checkerQuestionFormAndDifficult = async (params, formRepository) => {
  // Check if request params has duplicate formId
  const formIds = _.map(params, "formId");
  if (_.uniq(formIds).length !== formIds.length)
    throw new Error("FormId must be unique", 500);

  const checkerData = [];
  const forms = await formRepository.findAll(formIds);
  forms.forEach((form, index) => {
    params.forEach((param) => {
      if (param.formId === Number(form.id)) {
        checkerData[index] = {
          questionForm: _.map(form.questionForm, "number"),
          levelDifficult: param.levelDifficult,
        };
      }
    });
  });

  const check = isSameLevelDifficulty(checkerData);

  if (check === true)
    throw new Error(
      "Cannot use the same question form with the same level difficult.",
      400
    );
};

const isSameLevelDifficulty = (c) => {
  let x = {};
  let isSame = false;

  c.forEach((a) => {
    a.questionForm.forEach((c) => {
      let q = a.levelDifficult === null ? "infinite" : a.levelDifficult;
      if (x[c]) return x[c].push(q);

      x[c] = [q];
    });
  });

  function hasDuplicates(array) {
    return new Set(array).size !== array.length;
  }

  Object.values(x).forEach((q) => {
    // check if null
    if (q.indexOf("infinite") > -1 && q.length > 1) return (isSame = true);

    // check if duplicate
    if (hasDuplicates(q)) return (isSame = true);
  });

  return isSame;
};

module.exports = createOrUpdateQuestionServed;
