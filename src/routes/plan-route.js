const express = require('express');
const planController = require('../controllers/plan-controller');
const validate = require('../middlewares/validate');
const hotelValidation = require('../validations/hotel-validation');
const { authAccess } = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(authAccess, planController.getPlan);

router
	.route('/:planId')
	.get(authAccess, planController.getPlanById)
	.delete(authAccess, planController.deletePlan);

router.route('/detail/:dayId').get(authAccess, planController.getPlanDetail);

router
	.route('/detail/:dayId/activity')
	.post(authAccess, planController.addActivity);

router
	.route('/detail/:dayId/activity/:activityId')
	.delete(authAccess, planController.deleteActivity);

router.route('/create').post(authAccess, planController.createPlan);

module.exports = router;
