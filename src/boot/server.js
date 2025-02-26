const express = require("express");

const app = express();
const port = process.env.PORT;

try {
  app.listen(port);
} catch (error) {
  console.log(error);
}

module.exports = app;