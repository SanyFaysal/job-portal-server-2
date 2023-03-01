const {
  createJobService,
  getJobByIdService,
  getJobsService,
  updateJobService,
  getManagerJobService,
  applyJobService,
  getManagerJobDetailsByIdService,
  getManagerJobByIdService,
  deleteJobService,
  createCommentService,
  createAnswerService,
} = require('../service/job.service');

exports.createJob = async (req, res) => {
  try {
    const data = req.body;
    const hiringManager = req.user;
    const result = await createJobService(data, hiringManager);
    res.status(200).json({
      status: 'Success',
      message: 'Successfully create a job',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error: error.message,
    });
  }
};
exports.getJobById = async (req, res) => {
  try {
    const id = req.params.id.toString();
    const result = await getJobByIdService(id);
    if (!result) {
      return res.status(400).json({
        status: 'failed',
        message: "Couldn't found any job with this id",
      });
    }

    res.status(200).json({
      status: 'Success',
      message: 'Successfully get a job',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error: error.message,
    });
  }
};
exports.getJobs = async (req, res) => {
  try {
    const { sort, ...filter } = req.query;
    let sortBy = '';
    if (sort === 'oldToNew') {
      sortBy = 1
    }
    if (sort === 'newToOld') {
      sortBy = -1
    }
    // console.log(sort);
    // const salaryRangeQuery = filter?.salary;
    // const sortJob = {};
    // if (salaryRangeQuery) {
    //   const salaryRange = { salary: salaryRangeQuery };
    //   const filterBySalaryStringify = JSON.stringify(salaryRange);
    //   let filterBySalary = filterBySalaryStringify.replace(
    //     /\b(lt|gt)\b/g,
    //     (match) => `$${match}`
    //   );
    //   filterBySalary = JSON.parse(filterBySalary);
    //   filter.salary = filterBySalary.salary;
    // }
    // if (sort) {
    //   sortJob.sortBy = sort.split(',').join(' ');
    // }
    let queries = {};

    const { page = 1, limit = 5 } = req.query;

    // queries.filter = filter;
    const skip = (page - 1) * parseInt(limit);
    queries.skip = skip;
    queries.limit = parseInt(limit);
    const jobs = await getJobsService(sortBy, queries, filter);
    res.status(200).json({
      status: 'Success',
      message: 'Successfully get all job',
      data: jobs.result,
      page: jobs.page,
      pageFound: jobs.pageFound,
      total: jobs.total,
      totalFound: jobs.totalFound,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error: error.message,
    });
  }
};
exports.getManagerJob = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const results = await getManagerJobService(employeeId);
    res.status(200).json({
      status: 'Success',
      message: 'Successfully get all of your job posts',
      data: results,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error: error.message,
    });
  }
};
exports.getManagerJobById = async (req, res) => {
  try {
    const { _id: managerId } = req.user;
    const { id: jobId } = req.params;
    const results = await getManagerJobByIdService(managerId, jobId);
    res.status(200).json({
      status: 'Success',
      message: 'Successfully get details',
      results,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error: error.message,
    });
  }
};
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const jobs = await updateJobService(id, data);

    res.status(200).json({
      status: 'Success',
      message: 'Successfully get all job',
      data: jobs,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error: error.message,
    });
  }
};
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteJobService(id);
    res.status(200).json({
      status: 'Success',
      message: 'Delete successful',
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error: error.message,
    });
  }
};

exports.applyJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const candidateId = req.user._id;
    const result = await applyJobService(jobId, candidateId);

    res.status(200).json({
      status: 'Success',
      message: 'Applied successful',
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error: error.message,
    });
  }
};



exports.createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const jobs = await createCommentService(id, data);
    res.status(200).json({
      status: 'Success',
      message: 'Successfully get all job',
      data: jobs,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error: error.message,
    });
  }
};

exports.createAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    console.log({ id, data });
    const jobs = await createAnswerService(id, data);
    res.status(200).json({
      status: 'Success',
      message: 'Successfully get all job',
      data: jobs,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error: error.message,
    });
  }
}