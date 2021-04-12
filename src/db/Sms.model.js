const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const smsSchema = new Schema(
  {
    phone: { type: String, required: true },
    outgoingId: { type: String, required: true },
    orderNumber: { type: String, required: true },
    scheduledDatetime: { type: Date }
  },
  { timestamps: true }
);

mongoose.model('Sms', smsSchema);
