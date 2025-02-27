const User = require("../model/user-model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const generateToken = require("../utils/generateToken");

exports.fetchUsers = catchAsync(async (req, res, next) => {
  const {role} = req.params
  if (!role) {
    return next(new AppError("An Expicted Error",400));
  }
  let users;
  if(role === "workers"){
    users = await User.find({role: "worker"});
  } else if(role === "employees"){
    users = await User.find({role: "employer"});
  }

  res.status(200).json({
    status: "success",
    length: users.length,
    data: users,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Invalid email or password"));
  }
  const user = await User.findOne({ email }).select("+password");
  console.log("user: ", user);
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password"));
  }
  sendToken(req, res, user, "logged in successfully");
});
exports.signUp = catchAsync(async (req, res, next) => {
  const {
    email,
    password,
    Fname,
    Lname,
    phone,
    pin,
    passwordConfirm,
    birthday,
    gender,
    skills,
    location,
    role
  } = req.body;
 
  if (
    !email ||
    !password ||
    !Fname ||
    !Lname ||
    !phone ||
    !pin ||
    !passwordConfirm ||
    !birthday ||
    !gender ||
    !location
   ) {
    return next(new AppError("All fields are required"));
  }
  const newUser = await User.create({
    email,
    password,
    Fname,
    Lname,
    phone,
    birthday,
    gender,
    pin,
    passwordConfirm,
    skills,
    location,
    role
  });
  sendToken(req, res, newUser, "signup success");
});
const sendToken = async (req, res, user, message) => {
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  user.password = undefined;
  user.roll = undefined;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.otp = undefined;
  user.otpExpires = undefined;
  user.pin = undefined;
  const token = generateToken(user._id);
  res.status(200).json({
    success: "success",
    message,
    token,
    data: user,
  });
};
