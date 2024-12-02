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

/**
 * @swagger
 * /api/ads/upload:
 *   post:
 *     summary: Upload new banner advertisement
 *     tags: [Advertisements]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Banner uploaded successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/ads/banners:
 *   get:
 *     summary: Get all banner advertisements
 *     tags: [Advertisements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of all banners
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/ads/banners/{bannerId}:
 *   get:
 *     summary: Get banner by ID
 *     tags: [Advertisements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bannerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the banner
 *     responses:
 *       200:
 *         description: Banner details retrieved successfully
 *       404:
 *         description: Banner not found
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete banner by ID
 *     tags: [Advertisements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bannerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the banner to delete
 *     responses:
 *       200:
 *         description: Banner deleted successfully
 *       404:
 *         description: Banner not found
 *       401:
 *         description: Unauthorized
 *   patch:
 *     summary: Update banner by ID
 *     tags: [Advertisements]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: bannerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the banner to update
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *       404:
 *         description: Banner not found
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
/*
