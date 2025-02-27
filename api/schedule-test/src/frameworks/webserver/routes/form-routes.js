const express = require("express");
const router = express.Router();

module.exports = (controllers) => {
  const { formController: controller } = controllers;

  router.get("/forms/", controller.getAll);
  router.get("/form/:id", controller.findById);
  router.post("/form/ids", controller.getByIds);
  router.post("/form/", controller.upload, controller.create);
  router.patch("/form/:id", controller.upload, controller.update);
  router.delete("/form/:id", controller.destroy);
  router.get("/forms/export", controller.exportAll);
  router.get("/form/:id/export", controller.exportById);

  return router;
};
