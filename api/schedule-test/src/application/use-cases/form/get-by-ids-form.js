const Joi = require("joi");
const Error = require("../../../frameworks/helpers/app-error");
const _ = require("lodash");

const validate = (params) => {
  const schema = Joi.object({
    ids: Joi.array().items(Joi.number()),
  });

  const validator = schema.validate(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};

const getByIdsForm = async (repositories, fileSystem, params) => {
  const { formRepository } = repositories;

  validate(params);
  const { ids } = params;

  let forms = await formRepository.findAll(ids);

  if (forms.length > 0) {
    _.map(forms, async (form) => {
      form.file = await fileSystem.getUrl(form.file);
    });
  }
  return forms;
};

module.exports = getByIdsForm;
