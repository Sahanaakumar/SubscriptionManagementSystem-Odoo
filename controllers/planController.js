const Plan = require('../models/Plan');

// @desc    Create Plan
// @route   POST /api/plans
// @access  Private (Admin/Internal)
const createPlan = async (req, res) => {
    try {
        const plan = await Plan.create(req.body);
        res.status(201).json({
            message: 'Plan created successfully',
            data: plan
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get All Plans
// @route   GET /api/plans
// @access  Private
const getAllPlans = async (req, res) => {
    try {
        const plans = await Plan.find().populate('product');
        res.status(200).json({
            message: 'Plans retrieved successfully',
            data: plans
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Plan By Id
// @route   GET /api/plans/:id
// @access  Private
const getPlanById = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id).populate('product');
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.status(200).json({
            message: 'Plan retrieved successfully',
            data: plan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Plan
// @route   PUT /api/plans/:id
// @access  Private (Admin/Internal)
const updatePlan = async (req, res) => {
    try {
        const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.status(200).json({
            message: 'Plan updated successfully',
            data: plan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Plan
// @route   DELETE /api/plans/:id
// @access  Private (Admin/Internal)
const deletePlan = async (req, res) => {
    try {
        const plan = await Plan.findByIdAndDelete(req.params.id);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPlan,
    getAllPlans,
    getPlanById,
    updatePlan,
    deletePlan
};
