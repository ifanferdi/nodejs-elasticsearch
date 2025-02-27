const { Sequelize } = require("sequelize");

const sequelizeConnection = (config) => {
  // Database Configuration...

  const sequelize = new Sequelize({
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.dbname,
    dialect: config.database.dialect,
    logging: config.nodeEnv === "development" ? console.log : false,
  });

  sequelize
    .authenticate()
    .then(() => {
      console.log("Database is connected...");
    })
    .catch((err) => {
      console.log(err);
    });

  return sequelize;
};

module.exports = sequelizeConnection;
