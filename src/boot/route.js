const { bindRoutes } = require("./../routes");

class Route {
  async init(app) {
    try {
      await bindRoutes(app);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

module.exports = { Route };