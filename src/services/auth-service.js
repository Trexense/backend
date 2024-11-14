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

// 6. masuk sini
const register = async (body) => {
	const userExist = await existingUser(body.email);

	if (userExist) {
		throw new ApiError(httpStatus.status.BAD_REQUEST, 'Email already taken');
	}

	body.password = bcrypt.hashSync(body.password, 9);

	return await prisma.user.create({
		data: body,
	}); // 7. pas udah dibikin usernyha langsung return terus balik lagi ke controllers/auth-controller.js
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
		service: 'gmail',
		auth: {
			user: config.mail.user,
			pass: config.mail.pass,
		},
	});

	const token = generateVerifyEmailToken(userId, email);
	const verificationLink = `${config.backend.url}/auth/verification/email/confirm?token=${token}`;
	const mailOption = {
		from: config.mail.user,
		to: email,
		subject: 'Verify Your Email Address',
		html: `
			<div style="font-family: Arial, sans-serif; color: #333333; background-color: #f8f8f8; padding: 20px; text-align: center;">
				<div style="background-color: #ffffff; padding: 20px; border-radius: 8px; max-width: 500px; margin: auto; border: 1px solid #dddddd;">
					<h2 style="color: #333333;">Email Verification</h2>
					<p style="font-size: 16px;">Thank you for registering! Please verify your email address to complete the process.</p>
					<a href="${verificationLink}" style="display: inline-block; background-color: #4CAF50; color: #ffffff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 20px;">Verify Email</a>
					<p style="font-size: 14px; color: #555555; margin-top: 20px;">This link will expire in <strong>15 minutes</strong>.</p>
					<div style="margin-top: 20px; font-size: 12px; color: #777777;">
						<p>If you did not request this, please ignore this email.</p>
						<p>Best regards,<br>Trexense Team</p>
					</div>
				</div>
			</div>
		`,
	};

	try {
		await transporter.sendMail(mailOption);
	} catch (error) {
		throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
	}
};

const verifyEmail = async (email) => {
	return await prisma.user.update({
		where: {
			email: email,
		},
		data: {
			isEmailVerified: true,
		},
	});
};

const getUserById = async (userId) => {
	const user = await User.findByPk(userId);
	if (!user) {
	  throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}
	return user;
  };
  
  const updateUser = async (userId, updateBody) => {
	const user = await getUserById(userId);
	Object.assign(user, updateBody);
	await user.save();
	return user;
  };
  
  const deleteUser = async (userId) => {
	const user = await getUserById(userId);
	await user.destroy();
  };
  
  const requestResetPassword = async (email) => {
	const user = await User.findOne({ where: { email } });
	if (!user) {
	  throw new ApiError(httpStatus.NOT_FOUND, 'No user found with this email');
	}
	

	const resetPasswordToken = await tokenService.generateResetPasswordToken(email);

  };
  
  const resetPassword = async (email, newPassword) => {
	const user = await User.findOne({ where: { email } });
	if (!user) {
	  throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}
	
	user.password = newPassword;
	await user.save();
  };

module.exports = {
	register,
	login,
	sendEmailVerification,
	verifyEmail,
	getUserById,
	updateUser,
	deleteUser,
	requestResetPassword,
	resetPassword,
};
