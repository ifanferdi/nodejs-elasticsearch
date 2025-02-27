const paginate = require("../../../frameworks/helpers/resource-pagination");
const Joi = require("joi");
const Error = require("../../../frameworks/helpers/app-error");

const validate = (params) => {
  const schema = Joi.object({
    page: Joi.number(),
    limit: Joi.number().max(10000),
    search: Joi.string().allow(""),
  });

  const validator = schema.validate(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};

const getAllForm = async (repositories, fileSystem, params) => {
  const { formRepository } = repositories;

  const { page, limit, search, sort, sortType } = params;
  const offset = (page - 1) * limit;

  validate({ page, limit, search });

  let data = await formRepository.getAllForm({
    offset,
    limit,
    search,
    sort,
    sortType,
  });

  for (const form of data) {
    form.file = await fileSystem.getUrl(form.file);
  }

  const total = await formRepository.countForm({ search });

  return paginate(page, limit, total, data);
};

module.exports = getAllForm;
