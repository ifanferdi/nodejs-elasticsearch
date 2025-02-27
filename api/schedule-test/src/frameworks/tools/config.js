const config = require("../../config/config");

module.exports = {
  development: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.dbname,
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
  },
  production: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.dbname,
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
  },
};
