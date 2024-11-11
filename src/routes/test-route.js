const express = require('express');
const { authAccess, authAdmin, authRefresh } = require('../middlewares/auth');
const httpStatus = require('http-status');
const { generateAuthToken } = require('../services/token-service');

const router = express.Router();

router.route('/access').get(authAccess, (req, res) => {
	res.status(httpStatus.status.OK).send(`Hello ${req.user?.name}`);
});

router.route('/admin').get(authAdmin, (req, res) => {
	res.status(httpStatus.status.OK).send('Success');
});

router.route('/refresh').get(authRefresh, (req, res) => {
	const { accessToken, refreshToken } = generateAuthToken(
		req.user?.id,
		req.user?.name
	);
	res.status(httpStatus.status.OK).send({
		status: httpStatus.status.OK,
		message: 'Success',
		tokens: {
			access: accessToken,
			refresh: refreshToken,
		},
	});
});

module.exports = router;