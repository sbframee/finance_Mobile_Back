const express = require("express");

const router = express.Router();
const { v4: uuid } = require("uuid");
const Charges = require("../Models/Charges");

router.post("/postCharge", async (req, res) => {
  try {
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    value = { ...value, charge_uuid: uuid() };

    let response = await Charges.create(value);
    if (response) {
      res.json({ success: true, result: response });
    } else res.json({ success: false, message: "Charge Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.get("/GetChargesList", async (req, res) => {
  try {
    let data = await Charges.find({});

    if (data.length)
      res.json({ success: true, result: data.filter((a) => a.charge_uuid) });
    else res.json({ success: false, message: "Charges Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.put("/putCharge", async (req, res) => {
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

      let response = await Charges.updateOne(
        { charge_uuid: value.charge_uuid },
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
