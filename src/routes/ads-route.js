const express = require('express');
const adsController = require('../controllers/ads-controller');
const upload = require('../utils/multer');

const router = express.Router();

router
	.route('/upload')
	.post(upload.single('image'), adsController.uploadBanner);

module.exports = router;
