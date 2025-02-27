const Jobs = require("../model/jobModel");
const User = require("../model/user-model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const SendSMS = require("../utils/SendSMS");

exports.fetchJobs = catchAsync(async (req, res, next) => {
  const jobs = await Jobs.find({});
  res.status(200).json({
    status: "success",
    length: jobs.length,
    data: {
      jobs,
    },
  });
});
exports.createJob = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    payment,
    startDate,
    endDate,
    duration,
    location,
  } = req.body;
  if (
    !title ||
    !description ||
    !payment ||
    !startDate ||
    !endDate ||
    !duration ||
    !location
  ) {
    return next(new AppError("Please Provide All The Data", 400));
  }
  const job = await Jobs.create({
    title,
    description,
    payment,
    startDate,
    endDate,
    duration,
    location,
    createdBy: req.user.id,
  });
  try {
    await NotificationForUsers();
  } catch (err) {
    return next(new AppError("Error in Sending Message to All Users", 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      job,
    },
  });
});
const NotificationForUsers = async () => {
  const users = await User.find({});
  users.forEach(async (user) => {
    const user_number = await user.phone;
    await SendSMS({
      number: user_number,
      message: `
            There is a New Job posted by ${21}
            `,
    });
  });
};
