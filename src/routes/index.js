const express = require('express');
const authRouter = require('./auth-route');
const testRouter = require('./test-route');
const adsRouter = require('./ads-route');
const userRouter = require('../routes/user-route');

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
	{
		path: '/user',
		route: userRouter,
	},
];

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;
