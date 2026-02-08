const Customer = require('../models/Customer');

// @desc    Create Customer
// @route   POST /api/customers
// @access  Private (Admin/Internal)
const createCustomer = async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.status(201).json({
            message: 'Customer created successfully',
            data: customer
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get All Customers
// @route   GET /api/customers
// @access  Private
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json({
            message: 'Customers retrieved successfully',
            data: customers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Customer By Id
// @route   GET /api/customers/:id
// @access  Private
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({
            message: 'Customer retrieved successfully',
            data: customer
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Customer
// @route   PUT /api/customers/:id
// @access  Private (Admin/Internal)
const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({
            message: 'Customer updated successfully',
            data: customer
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Customer
// @route   DELETE /api/customers/:id
// @access  Private (Admin/Internal)
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
};
