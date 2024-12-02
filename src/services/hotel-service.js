const axios = require('axios');
const config = require('../configs/index');
const hereApiKey = config.here_api.apiKey;
const { encodeAddress } = require('../utils/coordinate');

const nearbyHotel = async (streetName) => {
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
};

module.exports = {
	nearbyHotel,
};
