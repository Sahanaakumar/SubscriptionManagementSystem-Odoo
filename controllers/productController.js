const Product = require('../models/Product');

// @desc    Create Product
// @route   POST /api/products
// @access  Private (Admin/Internal)
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get All Products
// @route   GET /api/products
// @access  Private
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            message: 'Products retrieved successfully',
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Product By Id
// @route   GET /api/products/:id
// @access  Private
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({
            message: 'Product retrieved successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Product
// @route   PUT /api/products/:id
// @access  Private (Admin/Internal)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Product
// @route   DELETE /api/products/:id
// @access  Private (Admin/Internal)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
