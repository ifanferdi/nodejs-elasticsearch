const express = require("express");
const router = express.Router();

module.exports = (controllers) => {
  const { questionController: controller } = controllers;

  router.get("/questions/:scheduleId", controller.getQuestionByScheduleId);

  return router;
};
