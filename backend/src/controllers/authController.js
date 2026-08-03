const authService = require('../services/authService');
const dbRepository = require('../repositories/dbRepository');

const authController = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }
      const result = await authService.login(email, password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  register: async (req, res, next) => {
    try {
      const result = await authService.registerPatient(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  getCurrentUser: async (req, res, next) => {
    try {
      const user = dbRepository.findUserById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found.' });

      let doctorId = null;
      let patientId = null;
      if (user.role === 'DOCTOR') {
        const doc = dbRepository.getDoctorByUserId(user.id);
        if (doc) doctorId = doc.id;
      } else if (user.role === 'PATIENT') {
        const pat = dbRepository.getPatientByUserId(user.id);
        if (pat) patientId = pat.id;
      }

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          doctorId,
          patientId
        }
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = authController;
