const User = require('../models/User');

exports.signupService = async (data) => {
  const result = await User.create(data);
  return result;
};
exports.findUserByEmailService = async (email) => {
  const result = await User.findOne({ email })
    .populate('applications');

  return result;
};
exports.getCandidateByIdService = async (id) => {
  const result = await User.findOne({ _id: id }).select('-password')
  return result;
};
exports.registerUserService = async (id, data) => {

  const result = await User.updateOne({ _id: id }, { $set: data });

  return result;
};
exports.getUsersService = async (role) => {
  const users = await User.find({ role })
    .select('-password')
    .populate('applications');
  return users;
};
exports.getUserDetailsByIdService = async (role, id) => {
  const userDetails = await User.find({ role: role, _id: id }).select(
    '-password'
  );
  return userDetails;
};
exports.updateCandidateRoleService = async (id) => {
  const userDetails = await User.updateOne(
    { _id: id },
    { $set: { role: 'hiring-manager' } }
  );
  return userDetails;
};
