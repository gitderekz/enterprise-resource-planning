const Invoice = require('../models/Invoice');

// Get all invoices
const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.findAll();
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching invoices', error: err.message });
    }
};

// Create a new invoice
const createInvoice = async (req, res) => {
    const { invoice_number, date, amount } = req.body;

    try {
        const invoice = await Invoice.create({
            invoice_number,
            date,
            amount,
        });
        res.status(201).json({ message: 'Invoice created successfully', invoice });
    } catch (err) {
        res.status(500).json({ message: 'Error creating invoice', error: err.message });
    }
};

// Update an invoice
const updateInvoice = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const invoice = await Invoice.findByPk(id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        invoice.status = status || invoice.status;
        await invoice.save();
        res.json({ message: 'Invoice updated successfully', invoice });
    } catch (err) {
        res.status(500).json({ message: 'Error updating invoice', error: err.message });
    }
};

// Delete an invoice
const deleteInvoice = async (req, res) => {
    const { id } = req.params;

    try {
        const invoice = await Invoice.findByPk(id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        await invoice.destroy();
        res.json({ message: 'Invoice deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting invoice', error: err.message });
    }
};

module.exports = { getInvoices, createInvoice, updateInvoice, deleteInvoice };