const Joi = require("joi");
const Error = require("../../../../frameworks/helpers/app-error");

module.exports = (params) => {
  const schema = Joi.object({
    id: Joi.number().required().max(9223372036854775807),
    batchId: Joi.number().required().max(9223372036854775807),
    date: Joi.date().required(),
    classroomId: Joi.number(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required().greater(Joi.ref("startTime")),
    type: Joi.string()
      .required()
      .valid("Kuis", "Ujian", "Ujian Masuk", "Seleksi Kelas"),
    desc: Joi.string().required().max(1000),
  });

  const validator = schema.validate(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};
