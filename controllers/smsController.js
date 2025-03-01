const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const SendAirTime = require("../utils/SendAirTime");
const SendSMS = require("../utils/SendSMS");
const generateOTP = require("../utils/generateOTP");
const User = require("../model/user-model");

exports.sendSms = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { number, message } = req.body;
  try {
    await SendSMS({ number, message });
  } catch (error) {
    return next(new AppError("There is an Error in sending The SMS", 400));
  }
  res.status(200).json({
    status: "success",
    message: "the send sms is done successfuly",
  });
});
exports.sendAirTime = catchAsync(async (req, res, next) => {
  const { number, currencyCode, amount } = req.body;
  if (!number || !currencyCode || !amount) {
    return next(new AppError("All fields are required", 400));
  }
  try {
    await SendAirTime({ number, currencyCode, amount });
  } catch (error) {
    return new AppError("There is an Error in sending The AirTime", 400);
  }
  res.status(200).json({
    status: "success",
    message: "sending the airTime in done Successfuly",
  });
});
exports.sendOTP = catchAsync(async (req, res, next) => {
  const number = req.body.phone;
  const id = req.user.id;
  if (!number) {
    return next(new AppError("Please Provide a Valid Number", 400));
  }
  const otp = await generateOTP();
  const otpExpires = Date.now() + 5 * 10 * 1000;
  const user = await User.findById(id);
  user.otp = otp;
  user.otpExpires = otpExpires;
  user.save({ validateBeforeSave: false });

  if (otp && otpExpires) {
    try {
      await SendSMS({
        number,
        message: `Your OTP is : ${otp} \n it's valid for 5 min`,
      });

      return res.status(200).json({
        status: "success",
        message: "Sending the otp is successfully",
      });
    } catch (err) {
      return res.status(200).json({
        status: "success",
        message: `There is an Error in Sending the Otp to Your Number : ${number}`,
      });
    }
  }
});
exports.verifyOTP = catchAsync(async (req, res, next) => {
  const { otp } = req.body;
  const id = req.user.id;
  const user = await User.findById(id);
  console.log(otp, user.otp);
  if(Date.now() > user.otpExpires){
    console.log("expires");
  }
  if (Date.now() > user.otpExpires || user.otp !== otp) {
    return res.status(200).json({
      message: `OTP is Expired, Please Provide a Valid OTP`,
    });
  }
  user.otp = "";
  user.otpExpires = "";
  user.verifyNumber = true;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    message: `The OTP is Valid`,
  });
});
