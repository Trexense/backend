const express = require('express');
const hotelController = require('../controllers/hotel-controller');
const upload = require('../utils/multer');
const validate = require('../middlewares/validate');
const adsValidation = require('../validations/ads-validation');
const { authAccess } = require('../middlewares/auth');

const router = express.Router();

router.route('/nearby').get(authAccess, hotelController.nearbyHotel);

module.exports = router;
