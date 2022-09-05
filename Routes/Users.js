const express = require("express");

const router = express.Router();
const { v4: uuid } = require("uuid");
const Users = require("../Models/Users");
const Firms = require("../Models/Firms");

router.post("/postUser", async (req, res) => {
  try {
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    value = { ...value, user_uuid: uuid() };

    let response = await Users.create(value);
    if (response) {
      res.json({ success: true, result: response });
    } else res.json({ success: false, message: "Users Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});
router.post("/loginUser", async (req, res) => {
  try {
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });

    let response = await Users.findOne({
      user_id: value.user_id,
      user_password: value.user_password,
    });
    response = JSON.parse(JSON.stringify(response));
    if (response) {
      let firmData = await Firms.findOne({ firm_uuid: response.firm_uuid });
      if (firmData) response = { ...response, firm_title: firmData.firm_title };
      res.json({ success: true, result: response });
    } else res.json({ success: false, message: "Users Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.get("/GetUsersList", async (req, res) => {
  try {
    let data = await Users.find({});

    if (data.length)
      res.json({ success: true, result: data.filter((a) => a.user_title) });
    else res.json({ success: false, message: "Users Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.put("/putUser", async (req, res) => {
  try {
    let result = [];
    for (let value of req.body) {
      if (!value) res.json({ success: false, message: "Invalid Data" });
      value = Object.keys(value)
        .filter((key) => key !== "_id")
        .reduce((obj, key) => {
          obj[key] = value[key];
          return obj;
        }, {});
      console.log(value);
      let response = await Users.updateOne(
        { user_uuid: value.user_uuid },
        value
      );
      if (response.acknowledged) {
        result.push({ success: true, result: value });
      } else result.push({ success: false, message: "Artical Not created" });
    }
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
