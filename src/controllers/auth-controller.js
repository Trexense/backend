const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth-service');
const tokenService = require('../services/token-service');

// 4. masuk kesini
const register = catchAsync(async (req, res) => {
	//catchasync disini fungsinya buat nangkep error, jadi kita gausah trycatch lagi, cuekin aja kodingan catchasync.js nya pokonya di controller sini functionnya bungkus aja pake catchasync ini
	const result = await authService.register(req.body); // 5. terus pake function yg aku pisahin di folder services, lanjut ke services/auth-service.js

	res.status(httpStatus.status.OK).send({
		status: httpStatus.status.OK, // ini pake library httpStatus biar gampang ngatur status codenya
		message: 'Success',
		data: result, //8. hasil return dari function di authService tadi kita kirim sebagai response
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

const sendEmailVerification = catchAsync(async (req, res) => {
	await authService.sendEmailVerification(req.user.id, req.user.email);
	res.status(httpStatus.status.OK).send({
		status: httpStatus.status.OK,
		message: 'Verification email sent',
	});
});

const verifyEmail = catchAsync(async (req, res) => {
	const result = await authService.verifyEmail(req.user.email);
	res.status(httpStatus.status.OK).send(`
    <html>
        <head>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-family: Arial, sans-serif;
                }
                .message-container {
                    text-align: center;
                }
                h1 {
                    color: #4CAF50;
                }
                p {
                    color: #333;
                }
            </style>
        </head>
        <body>
            <div class="message-container">
                <h1>Email Verification Successful</h1>
                <p>Thank you, ${result.name}. Your email has been successfully verified!</p>
            </div>
        </body>
    </html>
`);
});

const getUser = catchAsync(async (req, res) => {
	const user = await authService.getUserById(req.user.id);
	res.status(httpStatus.status.OK).send({
	  status: httpStatus.status.OK,
	  message: 'Success',
	  data: user
	});
  });
  
  const updateUser = catchAsync(async (req, res) => {
	const updatedUser = await authService.updateUser(req.user.id, req.body);
	res.status(httpStatus.status.OK).send({
	  status: httpStatus.status.OK,
	  message: 'Success',
	  data: updatedUser
	});
  });
  
  const deleteUser = catchAsync(async (req, res) => {
	await authService.deleteUser(req.user.id);
	res.status(httpStatus.status.OK).send({
	  status: httpStatus.status.OK,
	  message: 'User deleted successfully'
	});
  });
  
  const requestResetPassword = catchAsync(async (req, res) => {
	await authService.requestResetPassword(req.body.email);
	res.status(httpStatus.status.OK).send({
	  status: httpStatus.status.OK,
	  message: 'Password reset email sent'
	});
  });
  
  const resetPassword = catchAsync(async (req, res) => {
	await authService.resetPassword(req.user.email, req.body.password);
	res.status(httpStatus.status.OK).send({
	  status: httpStatus.status.OK,
	  message: 'Password reset successfully'
	});
  });

module.exports = {
	register,
	login,
	sendEmailVerification,
	verifyEmail,
	getUser,
	updateUser,
	deleteUser,
	requestResetPassword,
	resetPassword,
};
