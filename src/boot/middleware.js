const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const middlewares = require("./../middlewares/index.js");

class Middleware {
  async init(app) {
    try {
      // Static middlewares
      app.use(cookieParser());
      app.use(cors({
        origin: process.env.ORIGIN,
        credentials: true,
      }));
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));

      // Dynamically import and apply middleware from list
      await Promise.all(
        middlewares.list.map(async (middlewarePath) => {
          const middleware = await require(middlewarePath);
          if (middleware.default) {
            app.use(middleware.default);
          } else {
            app.use(middleware);
          }
        })
      );

      return Promise.resolve();
    } catch (error) {
      console.error("Error loading middleware:", error);
      return Promise.reject(error);
    }
  }
}

module.exports = { Middleware };
