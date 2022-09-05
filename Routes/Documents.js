const express = require("express");

const router = express.Router();
const { v4: uuid } = require("uuid");
const Documents = require("../Models/Documents");
const DocumentList = require("../Models/DocumentList");

router.post("/postDocument", async (req, res) => {
  try {
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    value = Object.keys(value)
      .filter((key) => key !== "_id")
      .reduce((obj, key) => {
        obj[key] = value[key];
        return obj;
      }, {});
    let response = await Documents.create(value);
    if (response) {
      res.json({ success: true, result: response });
    } else res.json({ success: false, message: "Documents Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.get("/GetDocuments/:customer_uuid", async (req, res) => {
  try {
    let data = await Documents.find({
      customer_uuid: req.params.customer_uuid,
    });
    data = JSON.parse(JSON.stringify(data));
    let result = [];
    for (let item of data) {
      let DocumentsData = await DocumentList.findOne({
        document_uuid: item.document_uuid,
      });
      result.push({ ...item, document_title: DocumentsData.document_title });
    }
    if (result.length) res.json({ success: true, result });
    else res.json({ success: false, message: "Articals Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.put("/putDocument", async (req, res) => {
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
      let response = await Documents.updateOne(
        {
          customer_uuid: value.customer_uuid,
          document_uuid: value.document_uuid,
        },
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
