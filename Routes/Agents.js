const express = require("express");

const router = express.Router();
const { v4: uuid } = require("uuid");
const Agents = require("../Models/Agents");

router.post("/postAgent", async (req, res) => {
  try {
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    value = { ...value, agent_uuid: uuid() };

    let response = await Agents.create(value);
    if (response) {
      res.json({ success: true, result: response });
    } else res.json({ success: false, message: "Agents Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.get("/GetAgentsList", async (req, res) => {
  try {
    let data = await Agents.find({});

    if (data.length)
      res.json({ success: true, result: data.filter((a) => a.agent_title) });
    else res.json({ success: false, message: "Item Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.put("/putAgent", async (req, res) => {
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
      let response = await Agents.updateOne(
        { agent_uuid: value.agent_uuid },
        value
      );
      if (response.acknowledged) {
        result.push({ success: true, result: value });
      } else result.push({ success: false, message: "Item Not created" });
    }
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
