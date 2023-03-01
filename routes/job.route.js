const express = require('express');
const jobController = require('../controller/job.controller');
const { authorization } = require('../middleware/authorization');
const { checkApplyExpire } = require('../middleware/checkApplyExpire');
const { checkIsOwner } = require('../middleware/checkIsOwner');
const { verifyToken } = require('../middleware/verifyToken');
const router = express.Router();

router
  .route('/jobs')
  .get(jobController.getJobs)
  .post(verifyToken, authorization('employee'), jobController.createJob);

router
  .route('/job/apply/:id')
  .patch(
    verifyToken,
    authorization('candidate'),
    checkApplyExpire,
    jobController.applyJob
  );
router
  .route('/job/comment/:id')
  .patch(verifyToken, authorization('candidate'), jobController.createComment)
  .post(jobController.createAnswer)


router
  .route('/employee/jobs')
  .get(
    verifyToken,
    authorization('employee'),
    jobController.getManagerJob
  );
router
  .route('/employee/jobs/:id')
  .get(
    verifyToken,
    authorization('hiring-manager'),
    jobController.getManagerJobById
  );

router
  .route('/job/:id')
  .get(jobController.getJobById)
  .patch(verifyToken, authorization('employee'), jobController.updateJob)
  .delete(verifyToken, authorization('employee'), checkIsOwner, jobController.deleteJob)

module.exports = router;
