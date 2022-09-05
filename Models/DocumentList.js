const mongoose = require("mongoose");

const DocumentsListSchema = new mongoose.Schema({
  document_uuid: {
    type: String,
  },
  document_title: {
    type: String,
  },
  
});

module.exports = mongoose.model("documents_list", DocumentsListSchema);
