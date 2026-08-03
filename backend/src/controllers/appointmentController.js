const appointmentService = require('../services/appointmentService');
const dbRepository = require('../repositories/dbRepository');

const appointmentController = {
  getAppointments: async (req, res, next) => {
    try {
      const appts = appointmentService.getAppointments(req.query, req.user);
      res.json(appts);
    } catch (err) {
      next(err);
    }
  },

  getAppointmentById: async (req, res, next) => {
    try {
      const appt = dbRepository.getAppointmentById(req.params.id);
      if (!appt) return res.status(404).json({ error: 'Appointment not found.' });
      res.json(appt);
    } catch (err) {
      next(err);
    }
  },

  bookAppointment: async (req, res, next) => {
    try {
      const appt = appointmentService.createAppointment(req.body, req.user);
      res.status(201).json(appt);
    } catch (err) {
      next(err);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const { status, cancellationReason } = req.body;
      const updated = appointmentService.updateStatus(req.params.id, status, cancellationReason, req.user);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  checkConflict: async (req, res, next) => {
    try {
      const { doctorId, date, startTime, endTime } = req.query;
      if (!doctorId || !date || !startTime || !endTime) {
        return res.status(400).json({ error: 'doctorId, date, startTime, and endTime query params required.' });
      }
      const conflict = appointmentService.checkConflict(doctorId, date, startTime, endTime);
      res.json(conflict);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = appointmentController;
