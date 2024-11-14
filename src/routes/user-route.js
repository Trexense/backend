const express = require('express');
const { authResetPassword } = require('../middlewares/auth');
const userController = require('../controllers/user-controller');
const {
	getUserById,
	updateUser,
	deleteUser,
	resetPasswordRequest,
} = require('../validations/user-validation');
const validate = require('../middlewares/validate');

const router = express.Router();

router
	.route('/:userId')
	.get(validate(getUserById), userController.getUser)
	.patch(validate(updateUser), userController.updateUser)
	.delete(validate(deleteUser), userController.deleteUser);

router
	.route('/:userId/reset-password/request')
	.post(validate(resetPasswordRequest), userController.requestResetPassword);

router
	.route('/reset-password/confirm')
	.get(authResetPassword, userController.resetPassword);

module.exports = router;
