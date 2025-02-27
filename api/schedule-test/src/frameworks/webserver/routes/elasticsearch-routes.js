const express = require("express");
const router = express.Router();

module.exports = (controllers) => {
  const { elasticsearchController: controller } = controllers;

  router.get("/elasticsearch", controller.index);
  router.get("/elasticsearch/:id", controller.show);
  router.post("/elasticsearch", controller.create);
  router.put("/elasticsearch/:id", controller.update);
  router.delete("/elasticsearch", controller.destroy);

  return router;
};
