const mongoose = require("mongoose");

const FormsListSchema = new mongoose.Schema({
  form_uuid: {
    type: String,
  },
  case_uuid: {
    type: String,
  },

  feilds: [
    {
      title: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("filled_forms", FormsListSchema);
