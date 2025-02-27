/*instrumentation.js*/
const o = "@opentelemetry/";
const opentelemetry = require(o + "sdk-node");
const { Resource } = require(o + "resources");
const {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_NAMESPACE,
  SEMRESATTRS_SERVICE_VERSION,
  SEMRESATTRS_SERVICE_INSTANCE_ID,
} = require(o + "semantic-conventions");
const { SimpleSpanProcessor, ConsoleSpanExporter } = require(o +
  "sdk-trace-node");
const { getNodeAutoInstrumentations } = require(o +
  "auto-instrumentations-node");
const { OTLPTraceExporter } = require(o + "exporter-trace-otlp-proto");
const { OTLPMetricExporter } = require(o + "exporter-metrics-otlp-proto");
const { PeriodicExportingMetricReader } = require(o + "sdk-metrics");
const { PrometheusExporter } = require(o + "exporter-prometheus");

require("dotenv").config();
const config = require("../../config/config");
const url = config?.jaeger?.url;

const resource = new Resource({
  [SEMRESATTRS_SERVICE_NAME]: config?.jaeger?.serviceName,
  // [SEMRESATTRS_SERVICE_NAMESPACE]: config?.jaeger?.serviceNamespace,
  // [SEMRESATTRS_SERVICE_VERSION]: config?.jaeger?.serviceVersion,
  // [SEMRESATTRS_SERVICE_INSTANCE_ID]: config?.jaeger?.serviceInstanceId,
});

const traceExporter = new OTLPTraceExporter({
  url: `${url}/v1/traces`, // optional - default url is http://localhost:4318/v1/traces
  headers: {}, // optional - collection of custom headers to be sent with each request, empty by default
});

const metricReader = new PeriodicExportingMetricReader({
  exporter: new OTLPMetricExporter({
    url: `${url}/v1/metrics`, // url is optional and can be omitted - default is http://localhost:4318/v1/metrics
    headers: {}, // an optional object containing custom headers to be sent with each request
    concurrencyLimit: 1, // an optional limit on pending requests
  }),
});

// const metricReader = new PrometheusExporter({
//   port: 9464, // optional - default is 9464
// });

const instrumentations = [
  getNodeAutoInstrumentations({
    "@opentelemetry/instrumentation-fs": { enabled: false },
    "@opentelemetry/instrumentation-express": { enabled: true },
    "@opentelemetry/instrumentation-http": require("./instrumentation-http"),
    "@opentelemetry/instrumentation-amqplib": require("./instrumentation-amqplib"),
    "@opentelemetry/instrumentation-aws-sdk": require("./instrumentation-aws-sdk"),
    "@opentelemetry/instrumentation-socket.io": require("./instrumentation-socket-io"),
    "@opentelemetry/instrumentation-redis-4": require("./instrumentation-redis"),
  }),
];

const spanProcessors = [new SimpleSpanProcessor(new ConsoleSpanExporter())];

const sdk = new opentelemetry.NodeSDK({
  resource, // a representation of the entity producing telemetry as resource attributes
  traceExporter, // send traces to a consumer
  metricReader, // allow the collection and reporting of raw measurements along with contextual information like time, labels, and resource
  instrumentations, // the process of adding observability code to an application to provide raw data about the system's behavior
  // spanProcessors, // To enable OpenTelemetry and see the context propagation in action
});

sdk.start();
