const Joi = require('joi');

const nearbyHotel = {
	body: Joi.object().keys({
		address: Joi.string().required(),
	}),
};

module.exports = {
	nearbyHotel,
};
