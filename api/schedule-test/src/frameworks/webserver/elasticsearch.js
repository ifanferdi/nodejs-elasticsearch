const { Client } = require("@elastic/elasticsearch");

module.exports = async (config) => {
  try {
    return new Client({ node: config.elasticsearch.host, auth: { apiKey: config.elasticsearch.key } });

    // console.log(
    //   await client.index({
    //     index: "aaaaa",
    //     id: "my_document_id",
    //     document: {
    //       foo: "foo",
    //       bar: "bar",
    //     },
    //   }),
    // );

    // console.log(
    //   await client.helpers.bulk({
    //     datasource: [{ foo: "bar", nama: "ifan2222-2", kelas: "1a" }],
    //     onDocument: function (doc) {
    //       return { index: { _index: "aaaaa" } };
    //     },
    //   }),
    // );
  } catch ({ meta }) {
    console.log(meta.meta.request);
  }
};
