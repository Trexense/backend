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

module.exports = {
	nearbyHotel,
};
