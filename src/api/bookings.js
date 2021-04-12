const express = require('express');
const router = express.Router();
const {
  models: { Sms },
  Types: { ObjectId }
} = require('mongoose');

const { sendSMS, getAllSMS, deleteSMS, getSMS } = require('../controllers/bookings');

const deleteMessages = async (data) => {
  const { orderNumber } = data
  const messages = await Sms.find({ orderNumber }).lean()
  await Sms.deleteMany({ orderNumber })
  return Promise.all(messages.map(async i => {
    try {
      return deleteSMS(i.outgoingId)
    } catch (e) {}
  }))
}

const sendMessagesAndSave = async (data) => {
  const { orderNumber } = data;
  const messages = await sendSMS(data)
  return Promise.all(messages.map(({ outgoing_id: outgoingId, destination, scheduledDatetime } ) => {
    return Sms.create({
      phone: destination,
      outgoingId,
      scheduledDatetime,
      orderNumber
    })
  }))
}

router.post('/', async function(req, res, next) {
  try {
    res.json(await sendMessagesAndSave(req.body));
  } catch (e) {
    next(e)
  }
});

router.post('/cancel', async function(req, res, next) {
  try {
    res.json(await deleteMessages(req.body));
  } catch (e) {
    next(e)
  }
});

router.post('/update', async function(req, res, next) {
  try {
    await deleteMessages(req.body)
    res.json(await sendMessagesAndSave(req.body));
  } catch (e) {
    next(e)
  }
});

router.post('/sync', async function(req, res, next) {
  try {
    const messages = await getAllSMS({ })
    res.json(messages)
  } catch (e) {
    next(e)
  }
});

module.exports = router;
