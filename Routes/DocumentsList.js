const express = require("express");

const router = express.Router();
const { v4: uuid } = require("uuid");
const DocumentsList = require("../Models/DocumentList");



router.get("/GetDocumentList", async (req, res) => {
  try {
    let data = await DocumentsList.find({});

    if (data.length)
      res.json({ success: true, result: data });
    else res.json({ success: false, message: "Documents Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});



module.exports = router;
