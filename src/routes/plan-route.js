const express = require('express');
const planController = require('../controllers/plan-controller');
const validate = require('../middlewares/validate');
const planValidation = require('../validations/plan-validation');
const { authAccess } = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(authAccess, planController.getPlan);

router
	.route('/create')
	.post(
		authAccess,
		validate(planValidation.createPlan),
		planController.createPlan
	);

router
	.route('/:planId')
	.get(
		authAccess,
		validate(planValidation.planById),
		planController.getPlanById
	)
	.delete(
		authAccess,
		validate(planValidation.planById),
		planController.deletePlan
	);

router
	.route('/detail/:dayId')
	.get(
		authAccess,
		validate(planValidation.dayId),
		planController.getPlanDetail
	);

router
	.route('/detail/:dayId/activity')
	.post(
		authAccess,
		validate(planValidation.addActivity),
		planController.addActivity
	);

router
	.route('/detail/:dayId/hotel')
	.post(
		authAccess,
		validate(planValidation.addHotelToPlan),
		planController.addHotelToPlan
	);

router
	.route('/activity/:activityId')
	.delete(
		authAccess,
		validate(planValidation.deleteActivity),
		planController.deleteActivity
	);

router
	.route('/hotel/:hotelPlanId')
	.delete(
		authAccess,
		validate(planValidation.deleteHotelFromPlan),
		planController.deleteHotelFromPlan
	);

module.exports = router;
