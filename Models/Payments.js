const mongoose = require("mongoose");

const PaymentsSchema = new mongoose.Schema({
  case_uuid: {
    type: String,
  },
  payment_uuid: {
    type: String,
  },
  user_uuid: {
    type: String,
  },
  amount: {
    type: Number,
  },

  time: {
    type: Number,
  },

  installment_count: {
    type: Number,
  },
});

module.exports = mongoose.model("payments", PaymentsSchema);
