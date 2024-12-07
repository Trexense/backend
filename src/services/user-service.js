const httpStatus = require('http-status');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const prisma = require('../../prisma/index');
const ApiError = require('../utils/apiError');
const { generateResetPasswordToken } = require('./token-service');
const config = require('../configs/index');

const getUserById = async (userId) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}

	return user;
};

const updateUser = async (userId, updateBody) => {
	await getUserById(userId);
	if (updateBody.email) {
		updateBody.isEmailVerified = false;
	}
	return await prisma.user.update({
		where: {
			id: userId,
		},
		data: { ...updateBody },
	});
};

const deleteUser = async (userId) => {
	await getUserById(userId);
	return await prisma.user.delete({
		where: {
			id: userId,
		},
	});
};

const requestResetPassword = async (userId, newPassword) => {
	const user = await getUserById(userId);
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: config.mail.user,
			pass: config.mail.pass,
		},
	});

	const hashPassword = bcrypt.hashSync(newPassword, 9);
	const token = generateResetPasswordToken(userId, hashPassword);
	const resetLink = `${config.backend.url}/user/reset-password/confirm?token=${token}`;
	const mailOption = {
		from: config.mail.user,
		to: user.email,
		subject: 'Reset Your Password',
		html: `
            <div style="font-family: Arial, sans-serif; color: #333333; background-color: #f8f8f8; padding: 20px; text-align: center;">
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; max-width: 500px; margin: auto; border: 1px solid #dddddd;">
                    <h2 style="color: #333333;">Password Reset</h2>
                    <p style="font-size: 16px;">We received a request to reset your password. Click the button below to proceed.</p>
                    <a href="${resetLink}" style="display: inline-block; background-color: #4CAF50; color: #ffffff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 20px;">Reset Password</a>
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

const resetPassword = async (userId, newPassword) => {
	await getUserById(userId);
	return await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			password: newPassword,
		},
	});
};

const userActivity = async (userId) => {
	return await prisma.user.findFirst({
		where: {
			id: userId,
		},
		select: {
			id: true,
			name: true,
			clicks: {
				select: {
					hotelId: true,
				},
			},
			bookmarks: {
				select: {
					hotelId: true,
				},
			},
		},
	});
};

module.exports = {
	getUserById,
	updateUser,
	deleteUser,
	requestResetPassword,
	resetPassword,
	userActivity,
};
