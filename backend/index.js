const express = require("express");
const cors = require("cors");
const appRouter = require("./routes/index");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", appRouter.router);

app.use("/", function (err, req, res, next) {
  res.staus(500).json({
    message: "Error got" + err,
  });
});

app.listen(3000, () => {
  console.log("Started server at 3000");
});
