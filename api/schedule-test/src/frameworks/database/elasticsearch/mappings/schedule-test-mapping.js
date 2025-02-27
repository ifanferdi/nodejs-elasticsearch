/**
 * references: https://www.elastic.co/guide/en/elasticsearch/reference/8.17/mapping.html
 *           : api/schedule-test/node_modules/@elastic/elasticsearch/lib/api/types.d.ts
 */
module.exports = {
  date_detection: true,
  numeric_detection: true,
  dynamic_date_formats: [
    "yyyy-MM-dd HH:mm:ss",
    "yyyy-MM-dd",
    "yyyy/MM/dd HH:mm:ss",
    "yyyy/MM/dd",
    "HH:mm:ss",
    "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
  ],
  // properties: {
  //   type: { type: "keyword" },
  //   desc: { type: "keyword" },
  // },
  dynamic_templates: [
    {
      strings: {
        match_mapping_type: "string",
        mapping: { type: "keyword", fields: { raw: { type: "keyword", ignore_above: 256 } } },
      },
    },
  ],
};
