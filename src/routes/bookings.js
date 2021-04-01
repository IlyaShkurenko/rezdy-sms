const express = require('express');
const router = express.Router();
const { sendSMS } = require('../controllers/bookings');

router.post('/', async function(req, res, next) {
  try {
    res.json(await sendSMS(req.body));
  } catch (e) {
    next(e)
  }
});

module.exports = router;
