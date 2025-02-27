const { lowerCase } = require("lodash");
const _ = require("lodash");

module.exports = async (repositories, profileId) => {
  const { courseApiRepository, profileApiRepository, scheduleApiRepository } =
    repositories.apiRepository;

  const profile = await profileApiRepository.getProfileById(profileId);

  if (lowerCase(profile?.profile?.typeAcc) === "siswa") {
    const classrooms = await courseApiRepository.getClassroomStudents({
      studentId: profileId,
    });

    const classroomIds = _.map(classrooms, "classroomId");

    const { data: sessions } = await scheduleApiRepository.findSession({
      classroomId: classroomIds,
    });

    return _.map(sessions, "id");
  }

  return null;
};
