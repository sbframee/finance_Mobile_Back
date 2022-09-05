const mongoose = require("mongoose");

const ChargesSchema = new mongoose.Schema({
  charge_uuid: {
    type: String,
  },
  charge_title: {
    type: String,
  },
  charge_type: {
    type: String,
  },
  value: {
    type: Number,
  },
  event: {
    type: String,
  },
  frequency: {
    type: String,
  },
});

module.exports = mongoose.model("charges", ChargesSchema);
