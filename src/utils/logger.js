const bunyan = require('bunyan');

const createLogger = (loggerName) => {
  const bunyanConfig = {
    name: loggerName
  }

  let logger = bunyan.createLogger(bunyanConfig);

  const constructInfo = (level) => {
    return (functionName, action, ...args) => {
      try {
        let errorType = 'NA';
        if(level  === 'error') {
          if(args[0] instanceof Error) {
            errorType = 'tech';
          } else {
            errorType = 'business';
          }
        }

        const logData = {
          logType: level,
          functionName,
          action,
          errorType
        }


        logger[level](
          {
            ...logData
          },
          ...args
        )
      } catch (error) {
        logger.error(error);
        logger[level](...args);
      }
    }
  }

  const logObj = {
    info: constructInfo('info'),
    error: constructInfo('error'),
  }
  
  return logObj;
}

module.exports = {
  createLogger
}