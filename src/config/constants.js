const VALIDATE_MODULE_NAMES = {
  USER: {
    module: "user",
    route: {
      LOGIN: "login"
    }
  },
  ATTENDANCE: {
    module: "attendance",
    route: {
      MARK: "mark",
      FETCH: "fetch",
      FETCH_ALL: "fetchAll"
    }
  }
}

const OPEN_ROUTE = ['/user/login','/api/v1/user/login'];

module.exports = {
  VALIDATE_MODULE_NAMES,
  OPEN_ROUTE
}