const sharp = require('sharp');
const httpStatus = require('http-status');
const vision = require('@google-cloud/vision');
const { v4: uuidv4 } = require('uuid');
const { Storage } = require('@google-cloud/storage');
const ApiError = require('../utils/apiError');
const config = require('../configs/index');
const prisma = require('../../prisma');
const credentialsJson = Buffer.from(config.gcp.credential, 'base64').toString(
	'utf-8'
);

const credential = JSON.parse(credentialsJson);
const visionClient = new vision.ImageAnnotatorClient({
	credentials: credential,
});
const storage = new Storage({ credentials: credential });

const resizeImage = async (image, width, height) => {
	return await sharp(image.buffer)
		.resize(width, height, {
			fit: sharp.fit.cover,
			position: sharp.strategy.entropy,
		})
		.toBuffer();
};

const filterImage = async (image) => {
	const [result] = await visionClient.safeSearchDetection(image);
	const detections = result.safeSearchAnnotation;

	if (!detections) {
		return true;
	}

	const isExplicit =
		detections.adult === 'LIKELY' ||
		detections.adult === 'VERY_LIKELY' ||
		detections.adult === 'POSSIBLE' ||
		detections.violence === 'LIKELY' ||
		detections.violence === 'VERY_LIKELY' ||
		detections.violence === 'POSSIBLE';

	if (isExplicit) {
		throw new ApiError(
			httpStatus.status.BAD_REQUEST,
			'This image contains explicit or violent content'
		);
	}

	return true;
};

const uploadImage = async (resizedImage) => {
	const shortUuid = uuidv4().split('-')[0];
	const uniqueFileName = `${Date.now()}-${shortUuid}.png`;
	const customMetadata = {
		contenType: 'image/*',
		metadata: {
			type: 'banner-image',
		},
	};

	const bucket = storage.bucket(config.gcp.bucket);
	const file = bucket.file(uniqueFileName);

	const stream = file.createWriteStream({
		resumable: false,
		metadata: customMetadata,
	});

	stream.end(resizedImage);
	stream.on('finish', () => {
		console.log(`File uploaded successfully as ${uniqueFileName}`);
	});

	stream.on('error', (err) => {
		console.error(`Failed to upload file: ${err.message}`);
	});

	return uniqueFileName;
};

const processAndUpload = async (image) => {
	try {
		const resizedImage = await resizeImage(image, 1200, 600);
		const isSafe = await filterImage(image.buffer);
		if (!isSafe) {
			throw new ApiError(
				httpStatus.status.BAD_REQUEST,
				'The image contains negative content'
			);
		}
		const fileName = await uploadImage(resizedImage);
		return fileName;
	} catch (error) {
		throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
	}
};

const saveAdBanner = async (image, body) => {
	const fileName = await processAndUpload(image);
	const url = `https://storage.googleapis.com/${config.gcp.bucket}/${fileName}`;
	body.bannerDuration = Number(body.bannerDuration);
	return await prisma.bannerAds.create({
		data: { imageUrl: url, ...body },
	});
};

const getAllBanners = async () => {
	return await prisma.bannerAds.findMany();
};

const getBannerById = async (bannerId) => {
	return await prisma.bannerAds.findFirst({
		where: {
			id: bannerId,
		},
	});
};

module.exports = {
	processAndUpload,
	saveAdBanner,
	getAllBanners,
	getBannerById,
};
