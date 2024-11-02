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

module.exports = {
	register,
};
