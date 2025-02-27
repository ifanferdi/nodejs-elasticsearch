const { getProfileById: profileById } = require("../api/profile-service");

const ProfileRepository = () => {
  const getProfileById = async (id) => {
    return await profileById(id);
  };

  return {
    getProfileById,
  };
};

module.exports = ProfileRepository;
