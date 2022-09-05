const express = require("express");

const router = express.Router();
const { v4: uuid } = require("uuid");
const Cases = require("../Models/Cases");
const Articles = require("../Models/Articles");
const Customers = require("../Models/Customers");
const Firms = require("../Models/Firms");
const Payments = require("../Models/Payments");
const Dealer = require("../Models/Dealer");
const Agents = require("../Models/Agents");

router.post("/postCase", async (req, res) => {
  try {
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    value = { ...value, case_uuid: uuid(), created_at: new Date().getTime() };
    let firmData = await Firms.findOne({ firm_uuid: value.firm_uuid });

    if (firmData) {
      value = { ...value, case_number: firmData.next_case_number };
      await Firms.updateOne(
        { firm_uuid: value.firm_uuid },
        { $inc: { next_case_number: 1 } }
      );
    }
    value = {
      ...value,
      stage: [
        {
          stage_number: value.current_stage,
          timestamp: new Date().getTime(),
          user_uuid: value.created_by,
        },
      ],
    };
    console.log(value);
    let response = await Cases.create(value);
    if (response) {
      res.json({ success: true, result: response });
    } else res.json({ success: false, message: "Case Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.get("/GetCasesList/:case_uuid", async (req, res) => {
  // try {
  let data = await Cases.findOne({ case_uuid: req.params.case_uuid });

  data = JSON.parse(JSON.stringify(data));
  let customerData = await Customers.findOne({
    customer_uuid: data.customer_uuid,
  });
  let guarantorData = await Customers.findOne({
    customer_uuid: data.guarantor_uuid,
  });
  console.log(guarantorData,data)
  let dealerData = await Dealer.findOne({
    dealer_uuid: data.dealer_uuid,
  });
  let agentData = await Agents.findOne({
    agent_uuid: data.agent_uuid,
  });
  let result = {
    customer_firstname: customerData?.customer_firstname || "",
    customer_middlename: customerData?.customer_middlename || "",
    customer_lastname: customerData?.customer_lastname || "",
    mobile: customerData?.mobile || [],
    address: customerData?.address || "",
    guarantor_firstname: guarantorData?.customer_firstname || "",
    guarantor_middlename: guarantorData?.customer_middlename || "",
    guarantor_lastname: guarantorData?.customer_lastname || "",
    guarantor_mobile: guarantorData?.mobile || [],
    guarantor_address: guarantorData?.address || "",
    dealer_title: dealerData?.dealer_title || "",
    agent_title: agentData?.agent_title || "",
    loan_amt:data?.loan_amt||"",
    number_of_installment:data?.number_of_installment||"",
    interest:data?.interest||"",
    Emi:data?.installment_status[0]?.amount||"",
    charges:data?.charges[0]?.amount||"",
  };
  console.log(result);
  if (result) res.json({ success: true, result });
  else res.json({ success: false, message: "Case Not found" });
  // } catch (err) {
  //   res.status(500).json({ success: false, message: err });
  // }
});
router.post("/GetCasesList", async (req, res) => {
  try {
    let value = req.body;
    let data = [];
    if (value.disbursal_status === "all" && value.current_stage === "all")
      data = await Cases.find({});
    else if (value.current_stage === "all")
      data = await Cases.find({ disbursal_status: value.disbursal_status });
    else if (value.disbursal_status === "all")
      data = await Cases.find({ current_stage: value.current_stage });
    else
      data = await Cases.find({
        disbursal_status: value.disbursal_status,
        current_stage: value.current_stage,
      });

    data = JSON.parse(JSON.stringify(data));
    data = data.filter((a) => {
      let date = new Date(a.disbursal_date).getTime();
      console.log(value.startDate < date < value.endDate);
      return a.case_uuid && value.startDate < date < value.endDate;
    });
    let result = [];
    for (let item of data) {
      let articalData = await Articles.findOne({
        article_uuid: item.article_uuid,
      });
      let article_title = "";
      if (articalData) article_title = articalData.article_title;

      let usersData = await Customers.findOne({
        customer_uuid: item.customer_uuid,
      });
      usersData = JSON.parse(JSON.stringify(usersData));
      let obj = {
        ...(usersData || {}),
        article_title,
        ...item,
        progress:
          item?.installment_status?.filter((a) => a.status)?.length +
          "/" +
          item?.installment_status?.length,
      };
      result.push(obj);
    }

    if (result.length) res.json({ success: true, result: result });
    else res.json({ success: false, message: "Case Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});
router.post("/GetEmiList", async (req, res) => {
  try {
    let value = req.body;
    console.log(value);
    let data = await Cases.find({ disbursal_status: 1 });
    data = JSON.parse(JSON.stringify(data));
    data = data.filter((a) => a.case_uuid);
    let result = [];
    for (let item of data) {
      let articalData = await Articles.findOne({
        article_uuid: item.article_uuid,
      });
      let article_title = "";
      if (articalData) article_title = articalData.article_title;

      let usersData = await Customers.findOne({
        customer_uuid: item.customer_uuid,
      });

      usersData = JSON.parse(JSON.stringify(usersData));
      let installment_status = item.installment_status.filter((a) => {
        let date = new Date(a?.date).getTime();

        return (
          value.startDate < date &&
          value.endDate > date &&
          +a.status === +value.status
        );
      });
      for (let item1 of installment_status) {
        let obj = {
          ...(usersData || {}),
          article_title,
          ...item1,
          case_number: item.case_number,
          case_uuid: item.case_uuid,

          installment_no: item?.installment_status?.length,
        };
        result.push(obj);
      }
    }

    if (result.length) res.json({ success: true, result: result });
    else res.json({ success: false, message: "Case Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.put("/putInvestment", async (req, res) => {
  try {
    let result = [];
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    let caseData = await Cases.findOne({ case_uuid: value.case_uuid });
    caseData = JSON.parse(JSON.stringify(caseData));
    let installment_status = caseData.installment_status;
    installment_status = installment_status.map((a) =>
      a.installment_count === value.installment_count ? { ...a, status: 1 } : a
    );
    let obj = { installment_status };

    if (!installment_status.filter((a) => !a.status).length)
      obj = {
        ...obj,
        current_stage: 5,
        stage: [
          ...(caseData.stage || []),
          {
            stage_number: 5,
            timestamp: new Date().getTime(),
            user_uuid: value.user_uuid,
          },
        ],
      };

    let response = await Cases.updateOne({ case_uuid: value.case_uuid }, obj);
    if (response.acknowledged) {
      let data = await Payments.create({
        ...value,
        payment_uuid: uuid(),
        time: new Date().getTime(),
      });
      console.log(data);
      res.json({ success: true, result: response });
    } else result.push({ success: false, message: "case Not update" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});
router.put("/putCase", async (req, res) => {
  try {
    let result = [];
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    value = Object.keys(value)
      .filter((key) => key !== "_id")
      .reduce((obj, key) => {
        obj[key] = value[key];
        return obj;
      }, {});
    if (value.charge_uuid)
      value = {
        ...value,
        charges: value.charges.map((a) =>
          a.uuid === value.charge_uuid
            ? { ...a, created_at: new Date().getTime() }
            : a
        ),
      };
    console.log(value, value.charges);
    let response = await Cases.updateOne({ case_uuid: value.case_uuid }, value);
    if (response.acknowledged) {
      res.json({ success: true, result: response });
    } else result.push({ success: false, message: "case Not update" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
