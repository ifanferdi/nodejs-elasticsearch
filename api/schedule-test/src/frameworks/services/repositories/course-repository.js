const {
  getSubjectCodesByCourse: subjectCodesByCourse,
  getSubjectById: subjectById,
  getCourseById: courseById,
  getStudents: students,
  getStudentCourseByProfileId: studentCourseByProfileId,
  getBatchById: batchById,
  getClassroomStudents: classroomStudents,
} = require("../api/course-service");

const CourseRepository = () => {
  const getSubjectCodesByCourse = async (params) => {
    return await subjectCodesByCourse(params);
  };

  const getSubjectById = async (params) => {
    return await subjectById(params);
  };

  const getCourseById = async (params) => {
    return await courseById(params);
  };

  const getBatchById = async (params) => {
    return await batchById(params);
  };

  const getStudents = async (params) => {
    return await students(params);
  };

  const getClassroomStudents = async (params) => {
    return await classroomStudents(params);
  };

  const getStudentCourseByProfileId = async (params) => {
    return await studentCourseByProfileId(params);
  };

  return {
    getSubjectCodesByCourse,
    getSubjectById,
    getCourseById,
    getBatchById,
    getStudents,
    getStudentCourseByProfileId,
    getClassroomStudents,
  };
};

module.exports = CourseRepository;
