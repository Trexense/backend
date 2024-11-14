const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
	port: process.env.PORT,
	jwt: {
		secret: process.env.JWT_SECRET,
		access: {
			expires: '1h',
		},
		refresh: {
			expires: '7d',
		},
		verifyEmail: {
			expires: '15m',
		},
	},
	mail: {
		user: process.env.EMAIL,
		pass: process.env.PASSWORD,
	},
	backend: {
		url: process.env.BACKEND_URL,
	},
	gcp: {
		credential: process.env.CREDENTIAL,
		bucket: process.env.BUCKET_NAME,
	},
};
