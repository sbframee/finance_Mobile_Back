const express = require("express");

const router = express.Router();
const { v4: uuid } = require("uuid");
const Dealer = require("../Models/Dealer");

router.post("/postDealer", async (req, res) => {
  try {
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    value = { ...value, dealer_uuid: uuid() };

    let response = await Dealer.create(value);
    if (response) {
      res.json({ success: true, result: response });
    } else res.json({ success: false, message: "Dealer Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.get("/GetDealersList", async (req, res) => {
  try {
    let data = await Dealer.find({});

    if (data.length)
      res.json({ success: true, result: data.filter((a) => a.dealer_uuid) });
    else res.json({ success: false, message: "Dealer Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.put("/putDealer", async (req, res) => {
//   try {
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
      let response = await Dealer.updateOne(
        { dealer_uuid: value.dealer_uuid },
        value
      );
      if (response.acknowledged) {
        result.push({ success: true, result: value });
      } else result.push({ success: false, message: "Dealer Not updated" });
    }
    res.json({ success: true, result });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err });
//   }
});

module.exports = router;
