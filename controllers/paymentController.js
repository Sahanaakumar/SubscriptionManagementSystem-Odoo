const Payment = require('../models/Payment');

// @desc    Create Payment
// @route   POST /api/payments
// @access  Private (Admin/Internal)
const createPayment = async (req, res) => {
    try {
        const payment = await Payment.create(req.body);
        res.status(201).json({
            message: 'Payment created successfully',
            data: payment
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get All Payments
// @route   GET /api/payments
// @access  Private
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('subscription');
        res.status(200).json({
            message: 'Payments retrieved successfully',
            data: payments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Payment By Id
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('subscription');
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({
            message: 'Payment retrieved successfully',
            data: payment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Payment
// @route   PUT /api/payments/:id
// @access  Private (Admin/Internal)
const updatePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({
            message: 'Payment updated successfully',
            data: payment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Payment
// @route   DELETE /api/payments/:id
// @access  Private (Admin/Internal)
const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment
};
