const { textSync } = require("figlet");
const { Database } = require("./database");
const { Middleware } = require("./middleware");
const { Route } = require("./route");

(async () => {
  try {
    const { default: chalk } = await import("chalk");

    const app = require("./server");
    const db = Database.getInstance();
    const middleware = new Middleware();
    const route = new Route();

    await db.initSupabase();
    console.log(chalk.bold.yellow(`supabase database connection established`));

    await middleware.init(app);
    console.log(chalk.bold.yellow(`middlewares linking complete`));

    await route.init(app);
    console.log(chalk.bold.yellow(`routes registration complete`));

    console.log(chalk.bold.yellow(`server listening on port ${process.env.PORT}`));

    console.log(textSync("A t t e n d a n c e - M a n a g e m e n t"));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
