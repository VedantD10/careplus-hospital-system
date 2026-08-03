const dbRepository = require('../repositories/dbRepository');

const doctorController = {
  getAllDoctors: async (req, res, next) => {
    try {
      res.json(dbRepository.getAllDoctors());
    } catch (err) {
      next(err);
    }
  },

  getDoctorById: async (req, res, next) => {
    try {
      const doc = dbRepository.getDoctorById(req.params.id);
      if (!doc) return res.status(404).json({ error: 'Doctor profile not found.' });
      res.json(doc);
    } catch (err) {
      next(err);
    }
  },

  getSchedule: async (req, res, next) => {
    try {
      const schedules = dbRepository.getDoctorSchedules(req.params.id);
      const leaves = dbRepository.getDoctorLeaves(req.params.id);
      res.json({ schedules, leaves });
    } catch (err) {
      next(err);
    }
  },

  addLeave: async (req, res, next) => {
    try {
      const { start_date, end_date, reason } = req.body;
      const leave = dbRepository.addDoctorLeave({
        doctor_id: Number(req.params.id),
        start_date,
        end_date,
        reason: reason || 'Personal Leave',
        status: 'APPROVED'
      });
      res.status(201).json(leave);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = doctorController;
