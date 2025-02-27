const axios = require("axios");
const config = require("../../../config/config");
const profileUrl = config.url.api.profile;
const Error = require("../../helpers/app-error");

const getProfileById = async (id) => {
  const { data } = await axios
    .get(profileUrl + "/profiles/" + id)
    .catch((error) => {
      console.log(error);
      throw new Error(error.response.data.message);
    });

  return data;
};

module.exports = {
  getProfileById,
};
