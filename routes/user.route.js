const express = require('express');
const userController = require('../controller/user.controller');
const { authorization } = require('../middleware/authorization');
const { verifyToken } = require('../middleware/verifyToken');
const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.findUserByEmail);
router.patch('/register/:id', userController.registerUser);
router.get('/me', verifyToken, userController.getMe);

router
  .route('/candidate/:id')
  .get(userController.getCandidate)
  .patch(
    verifyToken,
    authorization('admin'),
    userController.updateCandidateRole
  );

router
  .route('/:role/:id')
  .get(verifyToken, authorization('admin'), userController.getUserDetailsById);

router
  .route('/:role')
  .get(verifyToken, authorization('admin'), userController.getUsers);

module.exports = router;
