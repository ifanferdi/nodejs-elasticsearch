const express = require("express");
const cors = require("cors");

const expressConfig = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  // serving static files
  app.use("/storage", express.static("storage"));
};

module.exports = expressConfig;
