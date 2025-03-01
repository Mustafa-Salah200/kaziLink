require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

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
app.use("/images", express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.params.userId;
    const userDir = path.join(__dirname, "./uploads", userId);

    fs.readdir(userDir, (err, files) => {
      if (!files) {
        return fs.mkdirSync(userDir, { recursive: true });
        cb(null, userDir);
      }

      if (err) throw err;
      files.forEach((file) => {
        const filePath = path.join(userDir, file);
      });
    });

    fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString("hex"); //Generate unique name
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage });
app.post("/api/v1/upload/:userId", upload.single("file"), (req, res) => {
  try {
    if (req.file) {
      const fileInfo = {
        uniqueName: req.file.filename,
        filePath: req.file.path,
      };
      res
        .status(200)
        .json({
          status: "success",
          message: "Image uploaded successfully",
          data: fileInfo,
        });
    } else {
      res.status(400).json({ error: "No image uploaded" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error uploading image" });
  }
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});
app.use(errorControllers);

module.exports = app;
