const mongoose = require("mongoose");

const CustomersSchema = new mongoose.Schema({
  customer_firstname: {
    type: String,
  },
  customer_lastname: {
    type: String,
  },
  customer_middlename: {
    type: String,
  },
  customer_gender: {
    type: String,
  },
  customer_uuid: {
    type: String,
  },
  dob: {
    type: String,
  },
  address: {
    type: String,
  },
  mobile: [
    {
      label: {
        type: String,
      },
      number: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("customers", CustomersSchema);
