const cors = require("cors");
const express = require("express");
const connectDB = require("./config/mongoDb");
const morgan = require("morgan");

var bodyParser = require("body-parser");
const Agents = require("./Routes/Agents");
const Articles = require("./Routes/Articals");
const Users = require("./Routes/Users");
const Customers = require("./Routes/Customers");
const Cases = require("./Routes/Case");
const Payments = require("./Routes/Payments");
const Charges = require("./Routes/Charges");
const DocumentList = require("./Routes/DocumentsList");
const ChargesModel = require("./Models/Charges");
const CasesModel = require("./Models/Cases");
const Documents = require("./Routes/Documents");
const FormList = require("./Routes/FormList");
const Dealer = require("./Routes/Dealer");

connectDB();
app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(morgan("dev"));
// app.use(express.json());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
    parameterLimit: 50000,
  })
);

const updateCharges = async () => {
  let time = new Date().getTime();
  let chargesData = await ChargesModel.find({ event: 1 });
  chargesData = JSON.parse(JSON.stringify(chargesData));
  let casesData = await CasesModel.find({ current_stage: 3 });
  casesData = JSON.parse(JSON.stringify(casesData));
  let result = [];
  for (let item of casesData) {
    let installment_status = [];
    let update = false;
    for (let item1 of item.installment_status) {
      if (time - item1.date > 86400000 && +item1.status === 0) {
        update = true;
        let amount = +item1.amount;
        for (let a of chargesData) {
          amount =
            a.charge_type === "P"
              ? +amount + (+a.value / +item1.amount) * 100
              : a.charge_type === "A"
              ? +amount + a.value
              : 0;
        }

        item1 = { ...item1, amount };
      }
      installment_status.push(item1);
    }
    if (update)
      await CasesModel.updateOne(
        { case_uuid: item.case_uuid },
        { installment_status }
      );
    result.push({ ...item, installment_status });
  }

  return result;
};

app.use("/agents", Agents);
app.use("/articals", Articles);
app.use("/users", Users);
app.use("/customers", Customers);
app.use("/cases", Cases);
app.use("/payments", Payments);
app.use("/charges", Charges);
app.use("/documentsList", DocumentList);
app.use("/documents", Documents);
app.use("/formList", FormList);
app.use("/dealers", Dealer);
app.get("/updatecharge", async (req, res, next) => {
  const response = await updateCharges();
  res.json({ success: true, message: "Updated", result: response });
});
setInterval(function () {
  // Set interval for checking
  var date = new Date(); // Create a Date object to find out what time it is
  if (date.getHours() === 15) {
    console.log(date.getHours());
    // Check the time
    updateCharges();
  }
}, 360000);

module.exports = app;
