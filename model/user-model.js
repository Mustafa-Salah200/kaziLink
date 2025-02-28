const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  Fname: {
    type: String,
    trim: true,
    maxlength: [40, "A user name must have less or equal than 40 characters"],
    minlength: [2, "A user name must have more or equal than 2 characters"],
  },
  Lname: {
    type: String,
    trim: true,
    maxlength: [40, "A user name must have less or equal than 40 characters"],
    minlength: [2, "A user name must have more or equal than 2 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (val) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val); //basic email validation regex.
      },
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
    select: false,
  },
  verifyNumber: {
    type: Boolean,
    required: false,
    default: false,
  },
  verifyEmail: {
    type: Boolean,
    required: false,
    default: false,
  },
  passwordResetToken: {
    type: String,
    required: false,
    default: "",
  },
  passwordResetExpires: {
    type: Date,
    required: false,
    default: "",
  },
  otp: {
    type: String,
    required: false,
    default: "",
  },
  otpExpires: {
    type: Date,
    required: false,
    default: "",
  },
  role: {
    type: String,
    enum: ["worker", "employer", "admin"],
    default: "worker",
  },
  pin: {
    type: String,
    unique: true,
    require: true,
  },
  phone: {
    type: String,
    unique: true,
    require: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  birthday: {
    type: String,
    required: true,
  },
  skills: {
    type: [],
    required: false,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  location:{
    type:String,
    required:true
  },
  values:{
    type: [],
    required: false,
    default: []
  },
  about:{
    type: String,
    required:false,
    default: ''
  },
  feedback:{
    type: [],
    required: false,
    default: []
  },
  available:{
    type: Boolean,
    required: false,
    default: true
  },
  jobs:{
    type: [],
    required: false,
    default: []
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
