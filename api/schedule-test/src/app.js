(async () => {
  require("dotenv").config();
  const config = require("./config/config");
  const express = require("express");
  const routes = require("./frameworks/webserver/routes/routes");
  const redis = require("./frameworks/webserver/redis");
  const expressConfig = require("./frameworks/webserver/express");
  const serverConfig = require("./frameworks/webserver/server");
  const meilisearchConfig = require("./frameworks/webserver/meilisearch");
  if (config.elasticsearch.enabled) var elasticsearch = require("./frameworks/webserver/elasticsearch");
  const sequelizeConnection = require("./frameworks/database/sequelize-connection");
  const rabbitmqConnection = require("./frameworks/webserver/rabbitmq");
  let sentry = require("./frameworks/debug/sentry");

  const app = express();

  // DEFINE SENTRY
  sentry = sentry(app, config);
  sentry.beforeControllers();

  const sequelize = sequelizeConnection(config);
  const channel = await rabbitmqConnection(config);
  const redisServer = await redis.startServer();

  expressConfig(app);
  const server = serverConfig(app, config);
  server.startServer();

  const meilisearch = meilisearchConfig(config);
  const meilisearchClient = meilisearch.startServer();

  if (config.elasticsearch.enabled) var elasticsearchClient = await elasticsearch(config);

  /*===================================================IMPORT========================================================== */
  // MODEL
  const ScheduleTest = require("./frameworks/database/postgres/models/schedule-test");
  const Form = require("./frameworks/database/postgres/models/form");
  const Question = require("./frameworks/database/postgres/models/question");
  const QuestionServed = require("./frameworks/database/postgres/models/questionServed");
  // REPOSITORY
  const scheduleTestRepository = require("./frameworks/database/postgres/repositories/schedule-test-repository");
  const formRepository = require("./frameworks/database/postgres/repositories/form-repository");
  const questionRepository = require("./frameworks/database/postgres/repositories/question-repository");
  const questionServedRepository = require("./frameworks/database/postgres/repositories/question-served-repository");
  const courseApiRepo = require("./frameworks/services/repositories/course-repository");
  const profileApiRepo = require("./frameworks/services/repositories/profile-repository");
  const scheduleApiRepo = require("./frameworks/services/repositories/schedule-repository");
  const questionBankApiRepo = require("./frameworks/services/repositories/question-bank-repository");
  const assessmentCbtApiRepo = require("./frameworks/services/repositories/assessment-cbt-repository");
  const notificationApiRepo = require("./frameworks/services/repositories/notification-repository");
  const rabbitMqRepository = require("./frameworks/database/rabbitmq/repositories/rabbitmq-repository");
  const meilisearchRepository = require("./frameworks/database/meilisearch/repositories/meilisearch-repository");
  if (config.elasticsearch.enabled)
    var elasticsearchRepository = require("./frameworks/database/elasticsearch/repositories/elasticsearch-repository");
  // HELPERS
  const createNotification = require("./frameworks/helpers/create-notification");
  const rabbitHelper = require("./frameworks/helpers/rabbit-delay-trust");
  // USE CASE
  const scheduleTestUseCases = require("./application/use-cases/schedule-test/index");
  const formUseCases = require("./application/use-cases/form/index");
  const questionUseCases = require("./application/use-cases/question/index");
  const questionServedUseCases = require("./application/use-cases/question-served/index");
  if (config.elasticsearch.enabled) var elasticsearchUseCase = require("./application/use-cases/elasticsearch/index");
  // CONTROLLER
  const scheduleTestController = require("./adapters/controllers/schedule-test-controller");
  const formController = require("./adapters/controllers/form-controller");
  const questionController = require("./adapters/controllers/question-controller");
  const questionServedController = require("./adapters/controllers/question-served-controller");
  if (config.elasticsearch.enabled)
    var elasticsearchController = require("./adapters/controllers/elasticsearch-controller");
  // EVENT
  const events = require("./adapters/event/index");

  /*===================================================DEFINE========================================================== */
  // MODELS
  const models = {
    scheduleTestModel: await ScheduleTest(sequelize),
    formModel: await Form(sequelize),
    questionModel: await Question(sequelize),
    questionServedModel: await QuestionServed(sequelize),
  };
  // HELPER
  const helpers = {
    rabbitHelper: rabbitHelper(redisServer, channel),
  };
  // REPOSITORIES
  const repositories = {
    scheduleTestRepository: scheduleTestRepository(models),
    formRepository: formRepository(models),
    questionRepository: questionRepository(models),
    questionServedRepository: questionServedRepository(models),
    rabbitMqRepository: rabbitMqRepository(channel, helpers),
    meilisearchRepository: meilisearchRepository(meilisearchClient),
    elasticsearchRepository: config.elasticsearch.enabled ? elasticsearchRepository(elasticsearchClient) : undefined,
    apiRepository: {
      courseApiRepository: courseApiRepo(),
      profileApiRepository: profileApiRepo(),
      scheduleApiRepository: scheduleApiRepo(),
      questionBankApiRepository: questionBankApiRepo(),
      assessmentCbtApiRepository: assessmentCbtApiRepo(),
      notificationApiRepository: notificationApiRepo(),
    },
  };
  helpers.createNotification = createNotification.bind(null, repositories, config);
  // USE CASES
  const useCases = {
    scheduleTestUseCases: scheduleTestUseCases(repositories),
    formUseCases: formUseCases(repositories),
    questionUseCases: questionUseCases(repositories),
    questionServedUseCases: questionServedUseCases(repositories),
    elasticsearchUseCases: config.elasticsearch.enabled ? elasticsearchUseCase(repositories) : undefined,
  };
  // CONTROLLERS
  const controllers = {
    elasticsearchController: config.elasticsearch.enabled ? elasticsearchController(useCases) : undefined,
    scheduleTestController: scheduleTestController(useCases),
    formController: formController(useCases),
    questionController: questionController(useCases),
    questionServedController: questionServedController(useCases),
  };

  await routes(app, controllers);
  await events(repositories, helpers, meilisearchClient, useCases);

  // CLOSED SENTRY
  sentry.afterControllers();
})();
