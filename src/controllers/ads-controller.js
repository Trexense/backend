const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const adsService = require('../services/ads-service');
const ApiError = require('../utils/apiError');

const uploadBanner = catchAsync(async (req, res) => {
	const image = req.file;
	if (!image) {
		throw new ApiError(
			httpStatus.status.BAD_REQUEST,
			'Please upload image files'
		);
	}
	const body = Object.assign({}, req.body);

	const result = await adsService.saveAdBanner(image, body);
	res.status(httpStatus.status.OK).send({
		status: httpStatus.status.OK,
		message: 'Success',
		data: result,
	});
});

module.exports = {
	uploadBanner,
};
