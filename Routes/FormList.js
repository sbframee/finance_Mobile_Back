const express = require("express");

const router = express.Router();
const { v4: uuid } = require("uuid");
const Articles = require("../Models/Articles");
const FilledForms = require("../Models/FilledForms");
const FormList = require("../Models/FormList");

router.post("/postFormList", async (req, res) => {
  try {
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    value = { ...value, form_uuid: uuid() };

    let response = await FormList.create(value);
    if (response) {
      res.json({ success: true, result: response });
    } else res.json({ success: false, message: "Form Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});
router.post("/postFiledForm", async (req, res) => {
  try {
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    value = Object.keys(value)
    .filter((key) => key !== "_id")
    .reduce((obj, key) => {
      obj[key] = value[key];
      return obj;
    }, {});
    let response = await FilledForms.create(value);
    if (response) {
      res.json({ success: true, result: response });
    } else res.json({ success: false, message: "Form Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.get("/GetFormList", async (req, res) => {
  try {
    let data = await FormList.find({});

    if (data.length)
      res.json({ success: true, result: data.filter((a) => a.form_uuid) });
    else res.json({ success: false, message: "Form Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});
router.get("/GetForm/:article_uuid", async (req, res) => {
  try {
    let response = await Articles.findOne({
      article_uuid: req.params.article_uuid,
    });
    console.log(response);
    let data = await FormList.findOne({ form_uuid: response.form_uuid });
    data = JSON.parse(JSON.stringify(data));
    if (data)
      res.json({
        success: true,
        result: {
          ...data,
          feilds: data.feilds.map((a) => ({ ...a, uuid: uuid() })),
        },
      });
    else res.json({ success: false, message: "Form Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.put("/putformList", async (req, res) => {
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
      let response = await FormList.updateOne(
        { form_uuid: value.form_uuid },
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
