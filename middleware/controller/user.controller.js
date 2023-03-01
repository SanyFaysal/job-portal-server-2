const {
  signupService,
  findUserByEmailService,
  getUsersService,
  getUserDetailsByIdService,
  updateCandidateRoleService,
  registerUserService,
  getCandidateByIdService,
} = require('../service/user.service');
const { generateToken } = require('../utils/token');

exports.signup = async (req, res) => {
  try {
    const data = req.body;
    const { email } = data;
    const isAvailableUser = await findUserByEmailService(email);
    if (isAvailableUser) {
      return res.status(404).json({
        status: 'failed',
        error: 'User already existed',
      });
    }

    const result = await signupService(data);
    const token = generateToken(result);
    res.status(200).json({
      status: 'Success',
      message: 'Signup successful',
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error: error.message,
    });
  }
};
exports.findUserByEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        status: 'failed',
        error: 'Please give your credentials',
      });
    }

    const user = await findUserByEmailService(email);

    if (!user) {
      return res.status(401).json({
        status: 'failed',
        error: 'No result found with this email',
      });
    }

    const isValidPassword = user.comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        status: 'failed',
        error: 'Password not matched',
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      status: 'Success',
      message: 'Successfully logged in',
      data: user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error: error.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const { email } = req.user;
    const result = await findUserByEmailService(email);
    if (!result) {
      return res.status(400).json({
        status: 'failed',
        error: 'Token is not verified',
      });
    }

    res.status(200).json({
      status: 'Success',
      message: 'successfully get data',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error: error.message,
    });
  }
};
exports.getUsers = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await getUsersService(role);
    res.status(200).json({
      status: 'Success',
      message: 'Successfully get all the data',
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error: error.message,
    });
  }
};
exports.getCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await getCandidateByIdService(id);
    res.status(200).json({
      status: 'Success',
      message: 'Successfully get the data',
      data: candidate,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error: error.message,
    });
  }
};
exports.registerUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updateUser = await registerUserService(id, data);

    res.status(200).json({
      status: 'Success',
      message: 'Successfully registered',
      data: data,
      response: updateUser,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error: error.message,
    });
  }
};
exports.getUserDetailsById = async (req, res) => {
  try {
    const { role, id } = req.params;
    const userDetails = await getUserDetailsByIdService(role, id);
    if (!userDetails) {
      return res.status(400).json({
        status: 'failed',
        error: `Couldn\'t find any ${role} with this id`,
      });
    }

    res.status(200).json({
      status: 'Success',
      message: 'Successfully get all the data',
      data: userDetails,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error: error.message,
    });
  }
};
exports.updateCandidateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const update = await updateCandidateRoleService(id);

    if (!update.modifiedCount) {
      return res.status(400).json({
        status: 'failed',
        error: `Couldn\'t find any ${role} with this id`,
      });
    }
    res.status(200).json({
      status: 'Success',
      message: 'Successfully get all the data',
      data: update,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error: error.message,
    });
  }
};
