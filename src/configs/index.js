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
	},
};
