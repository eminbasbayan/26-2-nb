const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');
const { v4: uuidv4 } = require('uuid');

const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), 'dd.MM.yyyy\tHH:mm.ss');
  const logItem = `\n${dateTime}\t${uuidv4()}\t${message}`;

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }

    await fsPromises.appendFile(
      path.join(__dirname, '..', 'logs', logFileName),
      logItem,
    );
  } catch (error) {
    console.log(error);
  }
};

const logger = (req, res, next) => {
  const message = `${req.method}\t${req.url}\t${req.headers.origin}`;

  logEvents(message, 'reqLog.log');
  next();
};

module.exports = { logger, logEvents };
