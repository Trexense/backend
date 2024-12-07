const axios = require('axios');
const config = require('../configs/index');
const httpStatus = require('http-status');
const hereApiKey = config.here_api.apiKey;
const { encodeAddress } = require('../utils/coordinate');
const prisma = require('../../prisma');
const ApiError = require('../utils/apiError');

const nearbyHotel = async (streetName) => {
	try {
		const addressFormat = encodeAddress(streetName);
		const addressCoordinate = await axios.get(
			`https://geocode.search.hereapi.com/v1/geocode?q=${addressFormat}&apiKey=${hereApiKey}`
		);

		const { lat, lng } = addressCoordinate.data.items[0].position;
		const nearbyHotelRequest = await axios.get(
			`https://discover.search.hereapi.com/v1/discover?at=${lat},${lng}&radius=20&q=hotel&apiKey=${hereApiKey}`
		);

		let filterHotel = nearbyHotelRequest.data.items.filter((item) => {
			return item.title.toLowerCase().includes('hotel');
		});

		if (filterHotel.length < 1) {
			filterHotel = nearbyHotelRequest.data.items.filter((item) => {
				return (
					item.categories.length === 1 &&
					item.categories[0].id === '500-5000-0053'
				);
			});
		}

		return filterHotel;
	} catch (error) {
		console.log(error);
	}
};

const getHotel = async (hotelId) => {
	const hotel = await prisma.hotel.findFirst({
		where: {
			id: hotelId,
		},
	});

	if (!hotel) {
		throw new ApiError(httpStatus.status.NOT_FOUND, 'Hotel not found');
	}

	return hotel;
};

const addClick = async (userId, hotelId) => {
	try {
		await getHotel(hotelId);
		return await prisma.userHotelClick.create({
			data: {
				userId: userId,
				hotelId: hotelId,
			},
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error.code === 'P2002') {
			return {
				message:
					'Data already exists. This user has already bookmarked this hotel.',
			};
		}
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
	}
};

const addBookmark = async (userId, hotelId) => {
	try {
		const hotel = await getHotel(hotelId);
		if (!hotel) {
			throw new ApiError(httpStatus.status.NOT_FOUND, 'Hotel not found');
		}
		return await prisma.userHotelBookmark.create({
			data: {
				userId: userId,
				hotelId: hotelId,
			},
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error.code === 'P2002') {
			return {
				message:
					'Data already exists. This user has already bookmarked this hotel.',
			};
		}
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
	}
};

const deleteBookmark = async (hotelId) => {
	return await prisma.userHotelBookmark.delete({
		where: {
			hotelId: hotelId,
		},
	});
};

const getClick = async (userId) => {
	return await prisma.userHotelClick.findMany({
		where: {
			userId: userId,
		},
	});
};

const getBookmark = async (userId) => {
	return await prisma.userHotelBookmark.findMany({
		where: {
			userId: userId,
		},
	});
};

const getAllHotel = async () => {
	return await prisma.hotel.findMany({});
};

module.exports = {
	nearbyHotel,
	addClick,
	addBookmark,
	deleteBookmark,
	getClick,
	getBookmark,
	getAllHotel,
};
