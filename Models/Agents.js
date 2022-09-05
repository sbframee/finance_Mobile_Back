const mongoose = require("mongoose");

const AgentsSchema = new mongoose.Schema({
  agent_uuid: {
    type: String,
  },
  firm_uuid: {
    type: String,
  },
  agent_title: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  commission: [
    {
      article_uuid: {
        type: String,
      },
      "amt/percentage": {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("agents", AgentsSchema);
