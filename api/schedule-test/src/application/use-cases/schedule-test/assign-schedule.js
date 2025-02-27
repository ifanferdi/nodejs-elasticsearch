const { lowerCase } = require("lodash");
const _ = require("lodash");

module.exports = async (repositories, profileId, batchId) => {
  const { courseApiRepository, profileApiRepository } =
    repositories.apiRepository;

  const profile = await profileApiRepository.getProfileById(profileId);

  if (lowerCase(profile?.profile?.typeAcc) === "siswa") {
    const classrooms = await courseApiRepository.getClassroomStudents({
      studentId: profileId,
    });

    const batchIds = _.map(classrooms, (res) => res.classroom.batchId);

    return batchIds.includes(Number(batchId));
  }

  return true;
};
