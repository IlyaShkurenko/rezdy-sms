const moment = require('moment-timezone');

const smsglobal = require('smsglobal')('da4d4da2484817f10192b44ac38af58b', 'f452c4aea6c5e2b54d5b3cd97c5e2f8e');

const sendSMS = async (body) => {
  const { customer: { name, mobile }, items } = body
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
        origin: '61429557976',
        destination: mobile,
        message: `Dear ${name}, this a quick reminder from Quad Bike King that you must turn up at least 30 minutes before your ${productName}
      on ${aus.format('L')} at ${aus.format('LT')}. Our transfer vehicles must leave on time and if you are late you will lose your
      opportunity to enjoy the ${productName}.`,
        scheduledDateTime
      }

      smsglobal.sms.send(payload, function (error, response) {
        if(error) {
          const message = error.data && error.data.errors.origin && error.data.errors.origin.errors.join(',') || error;
          reject(new Error(message))
        }
        resolve(response)
      });
    })
  }))
  return events
}


module.exports = { sendSMS }
