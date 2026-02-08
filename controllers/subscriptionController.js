const Subscription = require('../models/Subscription');

// @desc    Create Subscription
// @route   POST /api/subscriptions
// @access  Private (Admin/Internal)
const createSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.create(req.body);
        res.status(201).json({
            message: 'Subscription created successfully',
            data: subscription
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get All Subscriptions
// @route   GET /api/subscriptions
// @access  Private
const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find().populate('customer plan');
        res.status(200).json({
            message: 'Subscriptions retrieved successfully',
            data: subscriptions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Subscription By Id
// @route   GET /api/subscriptions/:id
// @access  Private
const getSubscriptionById = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id).populate('customer plan');
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.status(200).json({
            message: 'Subscription retrieved successfully',
            data: subscription
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Subscription
// @route   PUT /api/subscriptions/:id
// @access  Private (Admin/Internal)
const updateSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.status(200).json({
            message: 'Subscription updated successfully',
            data: subscription
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Subscription
// @route   DELETE /api/subscriptions/:id
// @access  Private (Admin/Internal)
const deleteSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findByIdAndDelete(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSubscription,
    getAllSubscriptions,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription
};
