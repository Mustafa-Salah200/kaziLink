const jwt = require("jsonwebtoken");
const AppError = require("./appError");
const User = require("../model/user-model");
module.exports = async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return next(new AppError("Please Provide a Valid User"), 400);
  }
  const decode = await jwt.verify(token, process.env.JWT_SECRET);
  if (!decode) return next(new AppError("Please Provide a Valid Token", 400));
  const user = await User.findById(decode.id);
  req.user = user;
  next();
};
