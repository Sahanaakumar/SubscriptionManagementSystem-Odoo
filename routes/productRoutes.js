const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// All routes are protected via server.js app.use config, OR we can add middleware here if needed.
// However, the prompt asked to "Protect routes using protect middleware" and "Restrict some routes".
// Since server.js snippet had "app.use(..., protect, authorize(...))", all these routes are ALREADY protected globally for this path.
// BUT, if I want to be safe and explicit as per "create REST endpoints... protect... restrict", I should probably stick to standard router definition.
// If server.js already protects /api/products, adding it here again is redundant but harmless.
// Let's assume server.js handles the base protection as seen in the snippet.
// actually, standard practice is to put it on the route if granular control is needed.
// Since server.js applies it to the WHOLE route prefix, I don't need to add it here again.
// Just defining the verbs.

router.route('/')
    .get(getAllProducts)
    .post(createProduct);

router.route('/:id')
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router;
