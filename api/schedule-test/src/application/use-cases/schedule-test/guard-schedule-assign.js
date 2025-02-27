const { lowerCase } = require("lodash");
module.exports = async (repositories, profileId, schedule) => {
  const { profileApiRepository } = repositories.apiRepository;

  const profile = await profileApiRepository.getProfileById(profileId);
  const typeAcc = lowerCase(profile?.profile?.typeAcc);

  if (typeAcc === "wi")
    return (
      schedule.session.teacherId === profileId ||
      schedule.session.schedule.classroom.classMasterId === profileId
    );

  return false;
};
