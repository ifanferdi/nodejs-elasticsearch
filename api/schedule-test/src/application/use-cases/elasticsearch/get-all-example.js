const paginate = require("../../../frameworks/helpers/resource-pagination");

module.exports = async (repositories, params) => {
  const { elasticsearchRepository } = repositories;
  const { index, page, limit } = params;

  // Do validation here

  let { hits, total } = await elasticsearchRepository.search(index, params);
  return paginate(page, limit, total.value, hits);
};
