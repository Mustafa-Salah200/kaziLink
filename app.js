require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user-routes");
const errorControllers = require("./controllers/error-controllers");
const AppError = require("./utils/appError");
const smsRouter = require("./routes/smsRoute");
const jobRouter = require("./routes/jobRoute");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/sms", smsRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});
app.use(errorControllers);

module.exports = app;
