const Joi = require('joi');
const { objectId } = require('./custom-validation');

const uploadBanner = {
	body: Joi.object().keys({
		userId: Joi.string().required().custom(objectId),
		title: Joi.string().required(),
		description: Joi.string().optional(),
		startDate: Joi.string().required(),
		targetUrl: Joi.string().optional(),
		bannerDuration: Joi.any().required(),
	}),
};

module.exports = {
	uploadBanner,
};
