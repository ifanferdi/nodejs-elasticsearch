const axios = require("axios");
const config = require("../../../config/config");
const courseUrl = config.url.api.course;
const Error = require("../../helpers/app-error");

const getSubjectCodesByCourse = async (params) => {
  const { subjectCodes, courseId } = params;
  const { data } = await axios
    .post(courseUrl + "/courses/" + courseId + "/check-subjects", {
      codes: subjectCodes,
    })
    .catch((error) => {
      console.log(error);
      throw new Error(error.response.data.message);
    });

  return data.data;
};

const getSubjectById = async (params) => {
  const { id } = params;
  const { data } = await axios
    .get(courseUrl + "/subjects/" + id)
    .catch((error) => {
      console.log(error);
      throw new Error(error.response.data.message);
    });

  return data;
};

const getCourseById = async (params) => {
  const { id } = params;
  const { data } = await axios
    .get(courseUrl + "/courses/" + Number(id))
    .catch((error) => {
      console.log(error);
      throw new Error(error.response.data.message);
    });

  return data;
};

const getStudents = async (params) => {
  let url = courseUrl + "/classroom-students?";
  const query = ["limit=-1"];
  Object.keys(params).forEach((key) => query.push(`${key}=${params[key]}`));

  const { data } = await axios.get(url + query.join("&")).catch((error) => {
    console.log(error);
  });

  return data.data;
};

const getStudentCourseByProfileId = async (id) => {
  const { data } = await axios
    .get(courseUrl + `/student-courses/student/${id}?limit=-1`)
    .catch((error) => {
      console.log(error);
    });

  return data?.data;
};

const getBatchById = async (id) => {
  const { data } = await axios
    .get(courseUrl + "/batches/" + id)
    .catch((error) => {
      throw new Error(error.response.data.message);
    });

  return data;
};

const getClassroomStudents = async (params) => {
  const { courseId, classroomId, batchId, studentId } = params;
  let url = courseUrl + "/classroom-students?";

  if (courseId) url = url + `/courseId=${courseId}&`;
  if (classroomId) url = url + `/classroomId=${classroomId}&`;
  if (batchId) url = url + `/batchId=${batchId}&`;
  if (studentId) url = url + `/studentId=${studentId}&`;

  const { data } = await axios.get(url).catch((error) => {
    console.log(error);
  });

  return data.data;
};

module.exports = {
  getSubjectCodesByCourse,
  getSubjectById,
  getCourseById,
  getStudents,
  getStudentCourseByProfileId,
  getBatchById,
  getClassroomStudents,
};
