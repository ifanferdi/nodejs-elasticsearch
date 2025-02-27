const express = require("express");
const router = express.Router();

module.exports = (controllers) => {
  const { questionServedController: controller } = controllers;

  router.get("/serveQuestions/:scheduleId", controller.getAll);
  router.get("/serveQuestion/:id", controller.findById);
  router.post("/serveQuestion/:scheduleId", controller.createOrUpdate);

  return router;
};
