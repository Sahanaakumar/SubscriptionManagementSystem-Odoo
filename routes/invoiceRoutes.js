const express = require('express');
const router = express.Router();
const {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice
} = require('../controllers/invoiceController');

router.route('/')
    .get(getAllInvoices)
    .post(createInvoice);

router.route('/:id')
    .get(getInvoiceById)
    .put(updateInvoice)
    .delete(deleteInvoice);

module.exports = router;
