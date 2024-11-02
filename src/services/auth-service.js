const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const prisma = require('../../prisma/index');
const ApiError = require('../utils/apiError');

const existingUser = async (email) => {
	return await prisma.user.findUnique({
		where: {
			email,
		},
	});
};

const register = async (body) => {
	const userExist = await existingUser(body.email);

	if (userExist) {
		throw new ApiError(httpStatus.status.BAD_REQUEST, 'Email already taken');
	}

	body.password = bcrypt.hashSync(body.password, 9);

	return await prisma.user.create({
		data: body,
	});
};

const login = async (body) => {
	const user = await existingUser(body.email);
	if (!user) {
		throw new ApiError(
			httpStatus.status.UNAUTHORIZED,
			'Incorrect email or password'
		);
	}

	const validPassword = await bcrypt.compare(body.password, user.password);
	if (!validPassword) {
		throw new ApiError(
			httpStatus.status.UNAUTHORIZED,
			'Incorrect email or password'
		);
	}

	return user;
};

module.exports = {
	register,
	login,
};
