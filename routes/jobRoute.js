const express = require('express');
const { createJob, fetchJobs, updateJob, hire } = require('../controllers/jobController');
const getUser = require('../utils/getUser');
const jobRouter = express.Router();


jobRouter.route('/').get(fetchJobs).post(getUser,createJob)
jobRouter.patch('/:id',updateJob)
jobRouter.patch('/hire/:id',getUser,hire)


module.exports = jobRouter;