const axios = require("axios");
const config = require("../../../config/config");
const notificationUrl = config.url.api.notification;
const Error = require("../../helpers/app-error");

const create = async (params) => {
  const { user_ids, provider, data, institute, app } = params;

  const { data: result } = await axios
    .post(notificationUrl + "/notifications", {
      user_ids,
      provider,
      data,
      institute,
      app,
    })
    .catch((error) => {
      throw new Error(error.response.data.message);
    });

  return result;
};

module.exports = { create };
