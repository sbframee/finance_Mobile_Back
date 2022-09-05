const express = require("express");

const router = express.Router();
const { v4: uuid } = require("uuid");

const Payments = require("../Models/Payments");
const Users = require("../Models/Users");

router.post("/GetPaymentsList", async (req, res) => {
  try {
    let value = req.body;
    let data = await Payments.find({});
    data = JSON.parse(JSON.stringify(data));
    data = data.filter((a) => {
      return value.startDate < a.time && value.endDate > a.time;
    });
    let result = [];
    for (let item of data) {
      let usersData = await Users.findOne({ user_uuid: item.user_uuid });
      let obj = { ...item, user_title: usersData.user_title || "" };
      result.push(obj);
    }
    if (result.length) res.json({ success: true, result: result });
    else res.json({ success: false, message: "Case Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
