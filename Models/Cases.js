const mongoose = require("mongoose");

const CasesSchema = new mongoose.Schema({
  case_uuid: {
    type: String,
  },
  customer_uuid: {
    type: String,
  },
  guarantor_uuid: {
    type: String,
  },
  article_category: {
    type: String,
  },
  article_sub_category: {
    type: String,
  },
  created_by: {
    type: String,
  },
  created_at: {
    type: Number,
  },

  article_uuid: {
    type: String,
  },
  dealer_uuid: {
    type: String,
  },
  agent_uuid: {
    type: String,
  },
  firm_uuid: {
    type: String,
  },
  disbursal_date: {
    type: String,
  },
  emi_date: {
    type: String,
  },
  interest: {
    type: String,
  },
  loan_amt: {
    type: String,
  },
  disbursal_status: {
    type: Number,
  },
  current_stage: {
    type: Number,
  },
  down_payment: {
    type: Number,
  },
  number_of_installment: {
    type: Number,
  },
  stage: {
    type: String,
  },
  first_installment_date: {
    type: String,
  },
  case_number: {
    type: Number,
  },
  settlements: [
    {
      title: {
        type: String,
      },
      amount: {
        type: Number,
      },
      clearance_status: {
        type: Number,
      },
    },
  ],
  installment_status: [
    {
      date: {
        type: Number,
      },
      amount: {
        type: Number,
      },
      status: {
        type: Number,
      },
      installment_count: {
        type: Number,
      },
      remarks: {
        type: String,
      },
    },
  ],
  stage: [
    {
      stage_number: {
        type: Number,
      },
      timestamp: {
        type: Number,
      },
      user_uuid: {
        type: String,
      },
    },
  ],
  charges: [
    {
      title: {
        type: String,
      },
      uuid: {
        type: String,
      },
      created_by: {
        type: String,
      },
      amount: {
        type: Number,
      },
      status: {
        type: Number,
      },
      created_at: {
        type: Number,
      },
    },
  ],
});

module.exports = mongoose.model("cases", CasesSchema);
