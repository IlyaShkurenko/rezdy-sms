const logger = {
  log: (data, logsStore) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(data);
      if (logsStore) {
        logsStore.create({
          message: data.message,
          stack: data.stack,
          url: data.url,
          email: data.email
        });
      }
    }
  }
};

module.exports = { logger };
