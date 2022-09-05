const mongoose = require("mongoose");

const dealersListSchema = new mongoose.Schema({
  dealer_uuid: {
    type: String,
  },
  firm_uuid: {
    type: String,
  },
  dealer_title: {
    type: String,
  },
  bank_account_number: {
    type: Number,
  },
  bank_account_name: {
    type: String,
  },
  ifsc_code: {
    type: Number,
  },
  mobile: [
    {
      type: String,
    },
  ],
  remarks: {
    type: String,
  },
});

module.exports = mongoose.model("dealers", dealersListSchema);
