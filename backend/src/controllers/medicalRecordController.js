const medicalRecordService = require('../services/medicalRecordService');
const { generatePrescriptionHTML } = require('../utils/pdfGenerator');

const medicalRecordController = {
  getByAppointment: async (req, res, next) => {
    try {
      const record = medicalRecordService.getRecordByAppointment(req.params.appointmentId, req.user);
      if (!record) return res.status(404).json({ error: 'Medical record not found for this appointment.' });
      res.json(record);
    } catch (err) {
      next(err);
    }
  },

  getPatientHistory: async (req, res, next) => {
    try {
      const history = medicalRecordService.getPatientHistory(req.params.patientId, req.user);
      res.json(history);
    } catch (err) {
      next(err);
    }
  },

  createRecord: async (req, res, next) => {
    try {
      const result = medicalRecordService.createRecordWithPrescription(req.body, req.user);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  downloadPrescriptionPDF: async (req, res, next) => {
    try {
      const html = generatePrescriptionHTML(req.params.recordId);
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = medicalRecordController;
