const express = require('express');
const hotelController = require('../controllers/hotel-controller');
const upload = require('../utils/multer');
const validate = require('../middlewares/validate');
const hotelValidation = require('../validations/hotel-validation');
const { authAccess } = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(hotelController.getAllHotel);

router
	.route('/nearby')
	.get(
		authAccess,
		validate(hotelValidation.nearbyHotel),
		hotelController.nearbyHotel
	);

router.route('/:hotelId/clicks').post(authAccess, hotelController.addClick);

router
	.route('/:hotelId/bookmarks')
	.post(authAccess, hotelController.addBookmark)
	.delete(authAccess, hotelController.deleteBookmark);

router.route('/clicks').get(authAccess, hotelController.getClick);
router.route('/bookmarks').get(authAccess, hotelController.getBookmark);

module.exports = router;
