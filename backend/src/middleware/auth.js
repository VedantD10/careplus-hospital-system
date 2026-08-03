const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');
const dbRepository = require('../repositories/dbRepository');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required. Please log in.' });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token. Access denied.' });
    }

    const user = dbRepository.findUserById(userPayload.id);
    if (!user) {
      return res.status(401).json({ error: 'User account no longer exists.' });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Attach role specific entities
    if (user.role === 'DOCTOR') {
      const doc = dbRepository.getDoctorByUserId(user.id);
      if (doc) req.user.doctorId = doc.id;
    } else if (user.role === 'PATIENT') {
      const pat = dbRepository.getPatientByUserId(user.id);
      if (pat) req.user.patientId = pat.id;
    }

    next();
  });
};

const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Unauthorized resource access. Your role (${req.user.role}) lacks sufficient permissions.`
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole
};
