const mongoose = require('mongoose');

const connect = (uri, user, password, logger) => {
  return new Promise((resolve, reject) => {
    const settings = {
      // reconnectTries: 100,
      // reconnectInterval: 10000,
      // useNewUrlParser: true,
      // autoReconnect: true,
      // useFindAndModify: true,
      // useCreateIndex: true,
      // poolSize: 10,
      // bufferMaxEntries: 0
    };
    if (user && password) {
      mongoose.connect(uri, {
        ...settings,
        auth: {
          user,
          password
        }
      });
    } else {
      mongoose.connect(uri, settings);
    }
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', () => {
      resolve();
      logger.log(` db_user: ${process.env.DB_USER} connected to mongodb ${process.env.MONGO_URI}`);
    });
  });
};

const normalizedPath = require('path').join(__dirname);

require('fs')
  .readdirSync(normalizedPath)
  .filter(file => file[0].toUpperCase() === file[0])
  .forEach(i => {
    require(`./${i}`);
  });

module.exports = {
  close: () => mongoose.connection.close(),
  connect
};
