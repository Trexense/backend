const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth-service');
const tokenService = require('../services/token-service');

const register = catchAsync(async (req, res) => {
	const result = await authService.register(req.body);

	res.status(httpStatus.status.OK).send({
		status: httpStatus.status.OK,
		message: 'Success',
		data: result,
	});
});

const login = catchAsync(async (req, res) => {
	const result = await authService.login(req.body);
	const { accessToken, refreshToken } = tokenService.generateAuthToken(
		result.id,
		result.name
	);

	res.status(httpStatus.status.OK).send({
		status: httpStatus.status.OK,
		message: 'Success',
		data: result,
		tokens: {
			access: accessToken,
			refresh: refreshToken,
		},
	});
});

module.exports = {
	register,
	login,
};
