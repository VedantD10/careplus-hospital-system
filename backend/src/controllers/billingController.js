const billingService = require('../services/billingService');
const { generateInvoiceHTML } = require('../utils/pdfGenerator');

const billingController = {
  getAllBills: async (req, res, next) => {
    try {
      const bills = billingService.getAllBills(req.user);
      res.json(bills);
    } catch (err) {
      next(err);
    }
  },

  getBillById: async (req, res, next) => {
    try {
      const bill = billingService.getBillById(req.params.id);
      if (!bill) return res.status(404).json({ error: 'Bill invoice not found.' });
      res.json(bill);
    } catch (err) {
      next(err);
    }
  },

  payBill: async (req, res, next) => {
    try {
      const { paymentMethod } = req.body;
      const updated = billingService.processPayment(req.params.id, paymentMethod, req.user);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  downloadInvoicePDF: async (req, res, next) => {
    try {
      const html = generateInvoiceHTML(req.params.id);
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = billingController;
