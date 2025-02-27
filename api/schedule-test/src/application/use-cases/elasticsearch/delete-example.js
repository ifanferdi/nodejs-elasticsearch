module.exports = async (repositories, index, params) => {
  const { elasticsearchRepository } = repositories;
  const { id = null, prefixId: prefix } = params;

  if (id) return await elasticsearchRepository.destroy(index, id, prefix);
  else return await elasticsearchRepository.destroyIndex(index);
};
