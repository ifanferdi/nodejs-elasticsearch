module.exports = (app, config) => {
  const { port: PORT, ip: HOST } = config;

  const startServer = () => {
    app.listen(config.port, () =>
      console.log(`Server running on: ${HOST}:${PORT}`)
    );
  };

  return {
    startServer,
  };
};
