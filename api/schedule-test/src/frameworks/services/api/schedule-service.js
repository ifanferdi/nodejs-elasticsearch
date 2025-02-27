const axios = require("axios");
const config = require("../../../config/config");
const _ = require("lodash");
const url = config.url.api.schedule;

const findSessionById = async (id) => {
  const data = await axios.get(url + "/session/" + id).catch((error) => {
    console.log({ message: error.response.data.message });
  });

  return data?.data;
};

const findBulkSessionByIds = async (ids) => {
  const data = await axios.post(url + "/sessions/ids", ids).catch((error) => {
    console.log({ message: error.response });
  });

  return data?.data;
};

const findSession = async (params) => {
  const query = ["limit=-1"];
  if (params?.classroomId)
    _.map(params.classroomId, (id) => query.push(`classroomId[]=${id}`));
  const data = await axios
    .get(url + "/sessions?" + query.join("&"))
    .catch((error) => {
      console.log({ message: error.response });
    });

  return data?.data;
};

module.exports = {
  findSessionById,
  findBulkSessionByIds,
  findSession,
};
