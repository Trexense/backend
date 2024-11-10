const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const prisma = require('../../prisma/index');
const ApiError = require('../utils/apiError');
const nodemailer = require('nodemailer');
const config = require('../configs/index');
const { generateVerifyEmailToken } = require('./token-service');

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

const sendEmailVerification = async (userId, email) => {
	const transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: config.mail.user,
			pass: config.mail.pass,
		},
	});

	const token = generateVerifyEmailToken(userId, email);
	const verificationLink = `${config.backend.url}/verifyEmail?token=${token}`;
	const mailOption = {
		from: config.mail.user,
		to: email,
		subject: 'Email Verification',
		html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
	};

	try {
		await transporter.sendMail(mailOption);
	} catch (error) {
		throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
	}
};

module.exports = {
	register,
	login,
};
