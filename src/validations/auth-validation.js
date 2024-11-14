const Joi = require('joi');
const { password } = require('./custom-validation');

const register = {
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required().custom(password),
		name: Joi.string().required(),
	}),
};

const login = {
	body: Joi.object().keys({
		email: Joi.string().required(),
		password: Joi.string().required(),
	}),
};

const updateUser = {
	body: Joi.object().keys({
	  email: Joi.string().email(),
	  name: Joi.string(),
	  password: Joi.string().custom(password),
	}),
  };
  
  const resetPasswordRequest = {
	body: Joi.object().keys({
	  email: Joi.string().required().email(),
	}),
  };
  
  const resetPassword = {
	body: Joi.object().keys({
	  token: Joi.string().required(),
	  password: Joi.string().required().custom(password),
	}),
  };

module.exports = {
	register,
	login,
	updateUser,
	resetPasswordRequest,
	resetPassword,
};
