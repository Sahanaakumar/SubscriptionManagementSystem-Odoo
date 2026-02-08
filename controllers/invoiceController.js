const Invoice = require('../models/Invoice');

// @desc    Create Invoice
// @route   POST /api/invoices
// @access  Private (Admin/Internal)
const createInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.create(req.body);
        res.status(201).json({
            message: 'Invoice created successfully',
            data: invoice
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get All Invoices
// @route   GET /api/invoices
// @access  Private
const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate('subscription');
        res.status(200).json({
            message: 'Invoices retrieved successfully',
            data: invoices
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Invoice By Id
// @route   GET /api/invoices/:id
// @access  Private
const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate('subscription');
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(200).json({
            message: 'Invoice retrieved successfully',
            data: invoice
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Invoice
// @route   PUT /api/invoices/:id
// @access  Private (Admin/Internal)
const updateInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(200).json({
            message: 'Invoice updated successfully',
            data: invoice
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Invoice
// @route   DELETE /api/invoices/:id
// @access  Private (Admin/Internal)
const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice
};
