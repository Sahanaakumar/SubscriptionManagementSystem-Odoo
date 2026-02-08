const express = require('express');
const router = express.Router();
const {
    createPlan,
    getAllPlans,
    getPlanById,
    updatePlan,
    deletePlan
} = require('../controllers/planController');

router.route('/')
    .get(getAllPlans)
    .post(createPlan);

router.route('/:id')
    .get(getPlanById)
    .put(updatePlan)
    .delete(deletePlan);

module.exports = router;
