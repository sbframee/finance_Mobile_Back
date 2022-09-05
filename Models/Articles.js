const mongoose = require("mongoose");

const ArticlesSchema = new mongoose.Schema({
  article_uuid: {
    type: String,
  },
  form_uuid: {
    type: String,
  },
  article_title: {
    type: String,
  },
  firm_uuid: {
    type: String,
  },
  calculation_type: {
    type: String,
  },
  type: {
    type: String,
  },
  category: [
    {
      category_name: { type: String },
      uuid: { type: String },

      sub_category: [
        {
          sub_category_name: { type: String },
          uuid: { type: String },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("articles", ArticlesSchema);
