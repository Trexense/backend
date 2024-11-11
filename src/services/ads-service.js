const sharp = require('sharp');
const httpStatus = require('http-status');
const vision = require('@google-cloud/vision');
const { v4: uuidv4 } = require('uuid');
const { Storage } = require('@google-cloud/storage');
const ApiError = require('../utils/apiError');
const config = require('../configs/index');
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
	const safeSearch = result.safeSearchAnnotation;

	if (safeSearch.adult >= 4 || safeSearch.violence >= 4) {
		return false;
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
};

const processAndUpload = async (image) => {
	const isSafe = await filterImage(image.buffer);
	console.log(isSafe);
	if (!isSafe) {
		throw new ApiError(
			httpStatus.status.BAD_REQUEST,
			'The image contains negative content'
		);
	}

	const resizedImage = await resizeImage(image, 1200, 600);
	await uploadImage(resizedImage);

	return 'Upload Success';
};

module.exports = {
	processAndUpload,
};
