const ApiError = require('../utils/apiError');
const prisma = require('../../prisma/index');
const httpStatus = require('http-status');

const createPlan = async (body, userId) => {
	try {
		body.startDate = new Date(body.startDate);
		body.endDate = new Date(body.endDate);
		const days =
			Math.ceil((body.endDate - body.startDate) / (1000 * 60 * 60 * 24)) + 1;

		const plan = await prisma.plan.create({
			data: {
				userId: userId,
				...body,
			},
		});
		const planDetails = Array.from({ length: days }, (_, index) => ({
			day: index + 1,
			date: new Date(
				new Date(body.startDate).setDate(body.startDate.getDate() + index)
			),
			planId: plan.id,
		}));

		await prisma.planDetail.createMany({
			data: planDetails,
		});

		return plan;
	} catch (error) {
		console.log(error);
		throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
	}
};

const getPlan = async (userId) => {
	return await prisma.plan.findMany();
};

const getPlanById = async (planId) => {
	const plan = await prisma.plan.findFirst({
		where: {
			id: planId,
		},
		include: {
			planDetails: {
				include: {
					activities: true,
					hotel: true,
				},
			},
		},
	});

	if (!plan) {
		throw new ApiError(httpStatus.status.NOT_FOUND, 'Plan not found');
	}

	return plan;
};

const deletePlan = async (planId) => {
	await getPlanById(planId);

	return await prisma.plan.delete({
		where: {
			id: planId,
		},
	});
};

const getPlanDetail = async (planDetailId) => {
	const planDetail = await prisma.planDetail.findFirst({
		where: {
			id: planDetailId,
		},
		include: {
			activities: true,
			hotel: true,
		},
	});

	if (!planDetail) {
		throw new ApiError(httpStatus.status.NOT_FOUND, 'Day not found');
	}
	return planDetail;
};

const addActivity = async (planDetailId, body) => {
	await getPlanDetail(planDetailId);
	body.cost = parseFloat(body.cost);
	return await prisma.activity.create({
		data: {
			planDetailId: planDetailId,
			...body,
		},
	});
};

const deleteActivity = async (activityId) => {
	const activity = await prisma.activity.findFirst({
		where: {
			id: activityId,
		},
	});

	if (!activity) {
		throw new ApiError(httpStatus.status.NOT_FOUND, 'Activity not found');
	}

	return await prisma.activity.delete({
		where: {
			id: activityId,
		},
	});
};

const addHotelToPlan = async (dayId, body) => {
	return await prisma.hotelPlan.create({
		data: {
			planDetailId: dayId,
			...body,
		},
	});
};

const deleteHotelFromPlan = async (hotelPlanId) => {
	const hotelPlan = await prisma.hotelPlan.findFirst({
		where: {
			id: hotelPlanId,
		},
	});

	if (!hotelPlan) {
		throw new ApiError(httpStatus.status.NOT_FOUND, 'Hotel not found');
	}

	return await prisma.hotelPlan.delete({
		where: {
			id: hotelPlanId,
		},
	});
};

module.exports = {
	createPlan,
	getPlan,
	getPlanById,
	deletePlan,
	addActivity,
	getPlanDetail,
	deleteActivity,
	addHotelToPlan,
	deleteHotelFromPlan,
};
