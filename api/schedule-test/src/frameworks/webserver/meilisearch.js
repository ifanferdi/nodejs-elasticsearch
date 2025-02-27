const { MeiliSearch } = require("meilisearch");

module.exports = (config) => {
  const startServer = () => {
    return new MeiliSearch({
      host: config.meilisearch.host,
      apiKey: config.meilisearch.key,
    });
  };

  return { startServer };
};
