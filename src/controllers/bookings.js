const moment = require('moment-timezone');
const request = require('request-promise');

const smsglobal = require('smsglobal')(process.env.SMSGLOBAL_API_KEY, process.env.SMSGLOBAL_API_SECRET);
const { BadRequestError } = require('../errors')

const sendSMS = async (body) => {
  const { customer: { name, mobile, phone }, items } = body
  const events = await Promise.all(items.map(({ productName, startTime }) => {
    return new Promise((resolve, reject) => {
      let scheduledDateTime;
      const aus = moment(startTime).tz('Australia/Sydney');
      const format = 'yyyy-MM-DD HH:mm:ss'
      if(aus.date() === moment().tz('Australia/Sydney').date()) {
        if(aus.hours() - moment().tz('Australia/Sydney').hours() >= 4) {
          scheduledDateTime = moment(aus)
            .subtract(4, 'hours')
            .utc()
            .format(format)
        }
      }
      else if(aus.hours() < 11) {
        scheduledDateTime = moment(aus)
          .subtract(1, 'days')
          .set({ hour: 21, minute: 0 })
          .utc()
          .format(format)
      } else {
        scheduledDateTime = moment(aus)
          .subtract(4, 'hours')
          .utc()
          .format(format)
      }
      const payload = {
        origin: process.env.FROM,
        destination: (mobile || phone).replace(/\s/g, ''),
        message: `Dear ${name}, this a quick reminder from Quad Bike King that you must turn up at least 30 minutes before your ${productName}
      on ${aus.format('L')} at ${aus.format('LT')}. Our transfer vehicles must leave on time and if you are late you will lose your
      opportunity to enjoy the ${productName}.`,
        scheduledDateTime
      }
      smsglobal.sms.send(payload, function (error, response) {
        if(error) {
          reject(new BadRequestError(error))
        }
        resolve(response.data && response.data.messages && response.data.messages[0])
      });
    })
  }))
  return events
}


const getAllSMS = (options = {}) => {
  return new Promise((resolve, reject) => {
    smsglobal.sms.getAll(options, function (error, response) {
      if(error) {
        reject(new BadRequestError(error))
      }
      resolve(response)
    });
  })
}

const deleteSMS = (id) => {
  const url = `https://api.smsglobal.com/custom/delete-scheduled-message.php?username=${process.env.SMSGLOBAL_USERNAME}&password=${process.env.SMSGLOBAL_PASSWORD}&messageId=${id}`;
  return request({ method: 'DELETE', uri: url });
}


const getSMS = (id) => {
  return new Promise((resolve, reject) => {
    smsglobal.sms.get(id, function (error, response) {
      if(error) {
        reject(new BadRequestError(error))
      }
      resolve(response)
    });
  })
}

module.exports = { sendSMS, getAllSMS, deleteSMS, getSMS }
