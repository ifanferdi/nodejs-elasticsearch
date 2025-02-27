require("dotenv").config();

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  appUrl: process.env.APP_URL || "http://localhost:3000",
  ip: process.env.HOST || "http://localhost",
  app: process.env.APP || null,
  institute: process.env.INSTITUTE || null,
  database: {
    dialect: process.env.DB_DIALECT || "mysql",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "3306",
    dbname: process.env.DB_NAME || "sql",
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "localhost",
  },
  filesystem: process.env.FILESYSTEM || "local",
  s3: {
    region: process.env.S3_REGION || "us-east-1",
    accessKeyId: process.env.S3_ACCESS,
    secretAccessKey: process.env.S3_SECRET,
    endpoint: process.env.S3_API || "http://localhost:9000",
    forcePathStyle: true,
    bucketName: process.env.S3_BUCKETNAME || "storage",
    s3ProxyHost:
      process.env.S3_PROXY || process.env.S3_API || "http://localhost:9000",
    s3ProxyPath: process.env.S3_PROXY_PATH || "",
  },
  url: {
    api: {
      profile: process.env.PROFILE_URL,
      question: process.env.QUESTION_URL,
      schedule: process.env.SCHEDULE_URL,
      course: process.env.COURSE_URL,
      assessmentCbt: process.env.ASSESSMENT_CBT_URL,
      notification: process.env.NOTIFICATION_URL,
    },
    web: {
      //
    },
  },
  frontUrl: {
    ubk: process.env.UBK_URL,
  },
  redis: {
    uri: process.env.REDIS_URL || "redis://localhost:6379",
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || "6379",
  },
  rabbitmq: {
    host: process.env.RABBITMQ_HOST || "amqp://localhost",
    scheduleTestExchange: process.env.SCHEDULE_TEST_EXCHANGE || "schedule.test",
    registrationExchange: process.env.REGISTRATION_EXCHANGE || "schedule",
    scheduleExchange: process.env.SCHEDULE_EXCHANGE || "schedule",
    scheduleAnalyticExchange:
      process.env.SCHEDULE_ANALYTIC_EXCHANGE || "schedule.analytic.exchange",
    notification_exchange: process.env.NOTIFICATION_EXCHANGE || "queue",
  },
  meilisearch: {
    host: process.env.MEILISEARCH_HOST || "http://127.0.0.1:7700",
    key: process.env.MEILISEARCH_KEY || null,
  },
  elasticsearch: {
    enabled: process.env.ELASTICSEARCH_ENABLED?.toLowerCase() === "true",
    host: process.env.ELASTICSEARCH_HOST || "http://127.0.0.1:9200",
    key: process.env.ELASTICSEARCH_KEY || "",
  },
  jwtSecret: process.env.JWT_SECRET || "jkl!±@£!@ghj1237",
  applicationBehaviour: {
    formType: [1, 2, 3, 4, 5, 6, 7, 8],
    formTypeText: {
      1: "Form Soal Bentuk Structure Tipe A (Soal Teks, Pilihan Ganda)",
      2: "Form Soal Bentuk Structure Tipe B (Soal Teks dengan Gambar, Pilihan Ganda)",
      3: "Form Soal Bentuk Listening Tipe A (Soal Listening, Pilihan Ganda)",
      4: "Form Soal Bentuk Listening Tipe B (Soal Listening dengan Gambar, Pilihan Ganda)",
      5: "Form Soal Bentuk Structure Tipe C (Menentukan Fungsi Kata (S, P, KW, O))",
      6: "Form Soal Bentuk Structure Tipe D (Susun Kata)",
      7: "Form Soal Bentuk Essay Tipe A (Pengisian Kata Ganti)",
      8: "Form Soal Essay",
    },
  },
  sentry: { dsn: process.env.SENTRY_DSN },
  jaeger: {
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318",
    serviceName: process.env.OTEL_SERVICE_NAME || "service-name",
    serviceNamespace:
      process.env.JAEGER_SERVICE_NAMESPACE || "service-namespace",
    serviceVersion: process.env.JAEGER_SERVICE_VERSION || "1.0",
    serviceInstanceId:
      process.env.JAEGER_SERVICE_INSTANCE_ID || "service-namespace-1",
  },
};

module.exports = config;
