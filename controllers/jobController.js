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
exports.updateJob = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(new AppError("Please Provide a Valid ID", 400));
  const job = await Jobs.findByIdAndUpdate(id, {
    ...req.body
  });
  if (!job) return next(new AppError("Job Not Found", 404));
  const updatedJob = await Jobs.findById(id);
  res.status(200).json({
    status: "success",
    data: {
      updatedJob,
    },
  });

})
exports.hire = catchAsync(async(req,res,next)=>{
  const { id } = req.params;
  const user = req.user
  console.log(user);
  const {workerName,workerId} = req.body;
  if (!id ||!workerName ||!workerId) return next(new AppError("Please Provide All The Data", 400));
  const job = await Jobs.findByIdAndUpdate(id,{completed:true});
  if (!job) return next(new AppError("Job Not Found", 404));
  const worker = await User.findByIdAndUpdate(workerId, {
    $push: { jobs: id },
  });
  if (!worker) return next(new AppError("Worker Not Found", 404));
  try{
    await SendSMS({
      number: worker.phone,
      message: `
            JOB: ${job.title}
            You Geting Hire By ${user.Fname} ${user.Lname}
            you can contact with him in his phone ${user.phone}
            `,
    })
  } catch(err){
    return next(new AppError("Error in Sending Message to Worker", 400));
  }
  try{
    await SendSMS({
      number: user.phone,
      message: `
            JOB: ${job.title}
            You Hireing  ${worker.Fname} ${worker.Lname}
            `,
    })
  } catch(err){
    return next(new AppError("Error in Sending Message to User", 400));
  }

  const hiredJob = await Jobs.findById(id);
  res.status(200).json({
    status: "success",
    data: {
      hiredJob,
    },
  });
})
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
