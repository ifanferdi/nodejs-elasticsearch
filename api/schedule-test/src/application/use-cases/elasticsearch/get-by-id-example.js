module.exports = async (repositories, index, id) => {
  const { elasticsearchRepository } = repositories;

  return await elasticsearchRepository.getById(index, id);
};
