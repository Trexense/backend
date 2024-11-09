const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/apiError');

const authAccess = (req, res, next) => {
	passport.authenticate('jwt-access', { session: false }, (err, user, info) => {
		if (err || !user) {
			return next(
				new ApiError(
					httpStatus.status.UNAUTHORIZED,
					info?.message || 'Unauthorized'
				)
			);
		}

		req.user = user;
		next();
	})(req, res, next);
};

const authAdmin = (req, res, next) => {
	passport.authenticate('jwt-access', { session: false }, (err, user, info) => {
		if (err || !user) {
			return next(
				new ApiError(
					httpStatus.status.UNAUTHORIZED,
					info?.message || 'Unauthorized'
				)
			);
		}

		if (user.role !== 'admin') {
			return next(new ApiError(httpStatus.status.FORBIDDEN, 'Access Denied'));
		}
		next();
	})(req, res, next);
};

const authRefresh = (req, res, next) => {
	passport.authenticate(
		'jwt-refresh',
		{ session: false },
		(err, user, info) => {
			if (err || !user) {
				return next(
					new ApiError(
						httpStatus.status.UNAUTHORIZED,
						info.message || 'Unauthorized'
					)
				);
			}
			req.user = user;
			next();
		}
	)(req, res, next);
};

module.exports = {
	authAccess,
	authAdmin,
	authRefresh,
};
