const express = require('express');
const authRouter = require('./auth-route');
const testRouter = require('./test-route');
const adsRouter = require('./ads-route');

const router = express.Router();

const defaultRoutes = [
	{
		path: '/auth',
		route: authRouter,
	},
	{
		path: '/test',
		route: testRouter,
	},
	{
		path: '/ads',
		route: adsRouter,
	},
];

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

// 2. ini dipake buat looping defaultroutes diatas misal ke localhost:8080/auth nanti langsung ke route yg ada di auth, lanjut ke routes/auth-route.js

module.exports = router;
