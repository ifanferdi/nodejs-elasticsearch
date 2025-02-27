const express = require("express");
const router = express.Router();

module.exports = (controllers) => {
  const { scheduleTestController: controller } = controllers;

  router.get("/schedules", controller.getAll);
  router.get("/schedule/:id", controller.findById);
  // router.post("/schedule/", controller.create);
  // router.post("/schedule/bulk", controller.bulkCreate);
  router.patch("/schedule/:id", controller.update);
  router.get("/schedules/export", controller.exportAll);
  router.get("/schedule/:id/export", controller.exportById);
  router.post("/schedules/republish", controller.republish);

  return router;
};
