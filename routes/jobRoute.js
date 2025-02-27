const express = require('express');
const { createJob, fetchJobs } = require('../controllers/jobController');
const getUser = require('../utils/getUser');
const jobRouter = express.Router();


jobRouter.get('/',fetchJobs)
jobRouter.post('/',getUser,createJob)

module.exports = jobRouter;