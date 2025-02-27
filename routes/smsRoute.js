const express = require("express");
const { sendAirTime, sendSms, sendOTP, verifyOTP} = require("../controllers/smsController");
const getUser = require("../utils/getUser");

const smsRouter = express.Router();

smsRouter.post("/send-sms", sendSms);
smsRouter.post("/send-airTime", sendAirTime);
smsRouter.post("/send-otp",getUser, sendOTP);
smsRouter.post("/verify-otp",getUser, verifyOTP);

module.exports = smsRouter;
