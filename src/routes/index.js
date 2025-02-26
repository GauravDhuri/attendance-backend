const path = require('path');
const { promises: fs } = require('fs');

async function bindRoutes(app) {
  const version = 'v1';
  const routesDirectory = path.join(path.dirname(__filename), version);

  // Read all files in the routes directory
  const routeFiles = await fs.readdir(routesDirectory);

  // Dynamically import each route file and bind to the Express app
  await Promise.all(
    routeFiles.map(async (routeFile) => {
      if (routeFile.endsWith('.js')) {
        const routeName = routeFile.split('.')[0];
        const routeModule = require(path.join(routesDirectory, routeFile));
        app.use(`/api/${version}/${routeName}`, routeModule);
      }
    })
  );

  return Promise.resolve();
}

module.exports = { bindRoutes };
