const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  user_uuid: {
    type: String,
  },
  firm_uuid: {
    type: String,
  },
  user_id: {
    type: String,
  },
  user_password: {
    type: String,
  },
  user_title: {
    type: String,
  },
  user_type: {
    type: String,
  },
});

module.exports = mongoose.model("users", UsersSchema);
