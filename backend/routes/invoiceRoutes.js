const express = require('express');
const { getInvoices, createInvoice, updateInvoice, deleteInvoice } = require('../controllers/invoiceController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getInvoices);
router.post('/', auth, createInvoice);
router.put('/:id', auth, updateInvoice);
router.delete('/:id', auth, deleteInvoice);

module.exports = router;