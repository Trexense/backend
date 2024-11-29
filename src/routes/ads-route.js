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
		authAccess,
		upload.single('image'),
		validate(adsValidation.uploadBanner),
		adsController.uploadBanner
	);

router
	.route('/banners')
	.get(
		authAccess,
		validate(adsValidation.getAllBanner),
		adsController.getAllBanners
	);

router
	.route('/banners/:bannerId')
	.get(authAccess, adsController.getBannerById)
	.delete(authAccess, adsController.deleteBannerById)
	.patch(
		authAccess,
		upload.single('image'),
		validate(adsValidation.updateBanner),
		adsController.updateBanner
	);

module.exports = router;
