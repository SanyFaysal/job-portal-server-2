const Job = require('../models/Job');
const mongoose = require('mongoose');
const User = require('../models/User');

exports.createJobService = async (data, hiringManager) => {
  const { _id, name } = hiringManager;
  data.postedBy = {
    id: _id,
    name: name,
  };
  const result = await Job.create(data);
  return { result };
};
exports.getJobByIdService = async (id) => {
  const result = await Job.findOne({ _id: id })
    .populate('postedBy.id')
    .populate('applicants')
    .populate('queries.question.quesBy')
    .populate('queries.answer.ansBy');
  return result;
};
exports.getJobsService = async (sortBy, queries, filter) => {


  const result = await Job.find({
    "$or": [
      { "jobTitle": { $regex: filter.jobTitle } },
      { "jobType": { $regex: filter.jobType } },
      { "experience": { $regex: filter.experience } }
    ]
  })
    .sort({ createdAt: sortBy })
    .skip(queries.skip)
    .limit(queries.limit)
    .populate('applicants')
    .populate('postedBy.id');
  const total = await Job.countDocuments(result);
  const totalFound = await Job.find({
    "$or": [
      { "jobTitle": { $regex: filter.jobTitle } },
      { "jobType": { $regex: filter.jobType } },
      { "experience": { $regex: filter.experience } }
    ]
  }).count();

  const page = Math.ceil(total / queries.limit);
  const pageFound = Math.ceil(totalFound / queries.limit);

  return { page, pageFound, result, total, totalFound };

  //   const result = await Job.find({})
  //     // .where(filter)
  //     .sort({ createdAt: -1 })
  //     .skip(queries.skip)
  //     .limit(queries.limit)
  //     .populate('applicants')
  //     .populate('postedBy.id');

  //   const total = await Job.countDocuments(result);
  //   const page = Math.ceil(total / queries.limit);
  //   return { page, result, total };
  // }
  // if (sort === 'oldToNew') {
  //   const result = await Job.find({})
  //     // .where(filter)
  //     .sort({ createdAt: 1 })
  //     .skip(queries.skip)
  //     .limit(queries.limit)
  //     .populate('applicants')
  //     .populate('postedBy.id');

  //   const total = await Job.countDocuments(result);
  //   const page = Math.ceil(total / queries.limit);
  //   return { page, result, total };
  // }

};
exports.getManagerJobService = async (employeeId) => {
  const result = await Job.find({ 'postedBy.id': employeeId }).populate(
    'applicants'
  );
  return result;
};
exports.getManagerJobByIdService = async (managerId, jobId) => {
  const result = await Job.find({
    _id: jobId,
    'postedBy.id': managerId,
  }).populate('applicants');
  return result;
};
exports.updateJobService = async (id, data) => {
  const result = await Job.updateOne({ _id: id }, { $set: data });
  return result;
};
exports.deleteJobService = async (id) => {
  const result = await Job.deleteOne({ _id: id });
  return result;
};
exports.applyJobService = async (jobId, candidateId) => {
  const updateJob = await Job.updateOne(
    { _id: jobId },
    { $push: { applicants: candidateId } }
  );
  const updateCandidate = await User.updateOne(
    { _id: candidateId },
    { $push: { applications: jobId } }
  );

  return { updateJob, updateCandidate };
};


exports.createCommentService = async (id, data) => {
  console.log(id, data);
  const result = await Job.updateOne({ _id: id }, { $push: { queries: data } });
  console.log(result);
  return result;
};
exports.createAnswerService = async (id, data) => {
  const { questionId, ...answer } = data;
  console.log(id, data);
  const result = await Job.updateOne(
    { _id: id, 'queries._id': questionId }, // filter to find the document and the product to update
    { $push: { 'queries.$.answer': answer } } // update the claims array for the matching product using the positional operator '$'
  )
  console.log(result);
  return result;
};