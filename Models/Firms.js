const mongoose = require("mongoose");

const FirmsSchema = new mongoose.Schema({
  firm_uuid: {
    type: String,
  },
  firm_title: {
    type: String,
  },
  next_case_number: {
    type: Number,
  },
});

module.exports = mongoose.model("firms", FirmsSchema);
