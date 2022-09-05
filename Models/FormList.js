const mongoose = require("mongoose");

const FormsListSchema = new mongoose.Schema({
  form_uuid: {
    type: String,
  },
  firm_uuid: {
    type: String,
  },
  form_title: {
    type: String,
  },
  feilds: [
    {
      title: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("form_list", FormsListSchema);
