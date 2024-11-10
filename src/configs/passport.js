const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('../configs/index');
const { tokenType } = require('../configs/token');
const prisma = require('../../prisma');

const jwtOption = {
	secretOrKey: config.jwt.secret,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const verifyAccessToken = async (payload, done) => {
	try {
		if (payload.type !== tokenType.ACCESS) {
			return done(null, false, { message: 'Invalid token type' });
		}

		const user = await prisma.user.findFirst({
			where: {
				id: payload.userId,
			},
		});

		if (!user) {
			return done(null, false, { message: 'User not found' });
		}

		done(null, user);
	} catch (error) {
		done(error, false);
	}
};

const verifyRefreshToken = async (payload, done) => {
	try {
		if (payload.type !== tokenType.REFRESH) {
			return done(null, false, { message: 'Invalid token type' });
		}

		const user = await prisma.user.findFirst({
			where: {
				id: payload.userId,
			},
		});

		if (!user) {
			return done(null, false, { message: 'User not found' });
		}

		done(null, user);
	} catch (error) {
		done(error, false);
	}
};

const verifyEmailToken = async (payload, done) => {
	try {
		if (payload.type !== tokenType.VERIFY_EMAIL) {
			return done(null, false, { message: 'Invalid token type' });
		}

		const user = await prisma.user.findFirst({
			where: {
				id: payload.userId,
			},
		});

		if (!user) {
			return done(null, false, { message: 'User not found' });
		}

		done(null, user);
	} catch (error) {
		done(error, false);
	}
};

const accessStrategy = new JwtStrategy(jwtOption, verifyAccessToken);
const refreshStrategy = new JwtStrategy(jwtOption, verifyRefreshToken);
const emailStrategy = new JwtStrategy(jwtOption, verifyEmailToken);

module.exports = {
	accessStrategy,
	refreshStrategy,
	emailStrategy,
};
