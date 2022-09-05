const mongoose = require("mongoose");

const DocumentsSchema = new mongoose.Schema({
  document_uuid: {
    type: String,
  },
  unique_id: {
    type: String,
  },
  customer_uuid: {
    type: String,
  },
  name_on_document: {
    type: String,
  },
  address: {
    type: String,
  },
  dob: {
    type: String,
  },

  remarks: {
    type: String,
  },
});

module.exports = mongoose.model("documents", DocumentsSchema);
