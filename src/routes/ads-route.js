const express = require('express');
const adsController = require('../controllers/ads-controller');
const upload = require('../utils/multer');
const validate = require('../middlewares/validate');
const adsValidation = require('../validations/ads-validation');
const { authAccess } = require('../middlewares/auth');

const router = express.Router();

router
	.route('/upload')
	.post(
		upload.single('image'),
		validate(adsValidation.uploadBanner),
		adsController.uploadBanner
	);

router.route('/banners').get(authAccess, adsController.getAllBanners);

router.route('/banners/:bannerId').get(authAccess, adsController.getBannerById);

module.exports = router;
