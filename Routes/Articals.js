const express = require("express");

const router = express.Router();
const { v4: uuid } = require("uuid");
const Articals = require("../Models/Articles");

router.post("/postArtical", async (req, res) => {
  try {
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    value = { ...value, article_uuid: uuid() };

    let response = await Articals.create(value);
    if (response) {
      res.json({ success: true, result: response });
    } else res.json({ success: false, message: "Articals Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.get("/GetArticalsList", async (req, res) => {
  try {
    let data = await Articals.find({});

    if (data.length)
      res.json({ success: true, result: data.filter((a) => a.article_uuid) });
    else res.json({ success: false, message: "Articals Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.put("/putArtical", async (req, res) => {
  try {
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });

    console.log(value);
    let response = await Articals.updateOne(
      { _id: value._id },
      Object.keys(value)
        .filter((key) => key !== "_id")
        .reduce((obj, key) => {
          obj[key] = value[key];
          return obj;
        }, {})
    );
    if (response.acknowledged) {
      res.json({ success: true, result: value });
    } else res.json({ success: false, message: "Artical Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
