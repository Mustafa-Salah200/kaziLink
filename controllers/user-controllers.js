const User = require("../model/user-model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const generateToken = require("../utils/generateToken");

exports.fetchUsers = catchAsync(async (req, res, next) => {
  const { role } = req.params;
  if (!role) {
    return next(new AppError("An Expicted Error", 400));
  }
  let users;
  if (role === "workers") {
    users = await User.find({ role: "worker" });
    return sendToken(req, res, users, "success sending data");
  } else if (role === "employees") {
    users = await User.find({ role: "employer" });
    return sendToken(req, res, users, "success sending data");
  }
  next(new AppError("Couldn't find This path", 404));
});

exports.login = catchAsync(async (req, res, next) => {
  const { phone, password } = req.body;
  console.log({ phone, password });
  if (!phone || !password) {
    return next(new AppError("Invalid email or password"));
  }
  const user = await User.findOne({ phone }).select("+password");
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
    role,
  } = req.body;
  console.log({
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
    role,
  });

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
    role,
  });
  sendToken(req, res, newUser, "signup success");
});
exports.updataUser = catchAsync(async (req, res, next) => {
  const id = req.user.id;
  const user = await User.findByIdAndUpdate(id, { ...req.body });
  if (!user) {
    return next(new AppError("Error in Updating The User", 404));
  }
  const updateUser = await User.findById(id);
  sendToken(req, res, updateUser, "updating the user is successful");
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
