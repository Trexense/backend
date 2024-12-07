const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const hotelService = require('../services/hotel-service');

const nearbyHotel = catchAsync(async (req, res) => {
	const result = await hotelService.nearbyHotel(req.body.address);

	res.status(httpStatus.status.OK).send({
		status: httpStatus.status.OK,
		message: 'Success',
		data: result,
	});
});

const addClick = catchAsync(async (req, res) => {
	const result = await hotelService.addClick(req.user.id, req.params.hotelId);

	res.status(httpStatus.status.OK).send({
		status: httpStatus.status.OK,
		message: 'Success',
		data: result,
	});
});

const addBookmark = catchAsync(async (req, res) => {
	const result = await hotelService.addBookmark(
		req.user.id,
		req.params.hotelId
	);

	res.status(httpStatus.status.OK).send({
		status: httpStatus.status.OK,
		message: 'Success',
		data: result,
	});
});

module.exports = {
	nearbyHotel,
	addClick,
	addBookmark,
};
