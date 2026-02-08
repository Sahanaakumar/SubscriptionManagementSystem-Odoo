const express = require('express');
const router = express.Router();
const {
    createSubscription,
    getAllSubscriptions,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription
} = require('../controllers/subscriptionController');

router.route('/')
    .get(getAllSubscriptions)
    .post(createSubscription);

router.route('/:id')
    .get(getSubscriptionById)
    .put(updateSubscription)
    .delete(deleteSubscription);

module.exports = router;
