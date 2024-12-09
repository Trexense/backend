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

const getClick = catchAsync(async (req, res) => {
	const result = await hotelService.getClick(req.user.id);

	res.status(httpStatus.status.OK).send({
		status: httpStatus.status.OK,
		message: 'Success',
		data: result,
	});
});

const getBookmark = catchAsync(async (req, res) => {
	const result = await hotelService.getBookmark(req.user.id);

	res.status(httpStatus.status.OK).send({
		status: httpStatus.status.OK,
		message: 'Success',
		data: result,
	});
});

const deleteBookmark = catchAsync(async (req, res) => {
	const result = await hotelService.deleteBookmark(req.params.hotelId);

	res.status(httpStatus.status.OK).send({
		status: httpStatus.status.OK,
		message: 'Success',
		data: result,
	});
});

const getAllHotel = catchAsync(async (req, res) => {
	const result = await hotelService.getAllHotel();

	res.status(httpStatus.status.OK).send({
		status: httpStatus.status.OK,
		message: 'Success',
		data: result,
	});
});

const recommendation = catchAsync(async (req, res) => {
	const result = await hotelService.recommendation(
		'de697edd-38ac-4afa-a0a0-9f45c3d19144'
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
	getClick,
	getBookmark,
	deleteBookmark,
	getAllHotel,
	recommendation,
};
