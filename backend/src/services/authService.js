const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/jwt');
const dbRepository = require('../repositories/dbRepository');

const authService = {
  login: async (email, password) => {
    const user = dbRepository.findUserByEmail(email);
    if (!user) {
      throw { statusCode: 401, message: 'Invalid email or password.' };
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Invalid email or password.' };
    }

    let doctorInfo = null;
    let patientInfo = null;

    if (user.role === 'DOCTOR') {
      doctorInfo = dbRepository.getDoctorByUserId(user.id);
    } else if (user.role === 'PATIENT') {
      patientInfo = dbRepository.getPatientByUserId(user.id);
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Log login action
    dbRepository.createAuditLog({
      user_id: user.id,
      action: 'USER_LOGIN',
      resource: 'User',
      resource_id: String(user.id),
      details: `User ${user.email} (${user.role}) logged in successfully.`
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        doctorId: doctorInfo ? doctorInfo.id : null,
        patientId: patientInfo ? patientInfo.id : null
      }
    };
  },

  registerPatient: async (patientData) => {
    const { name, email, password, phone, date_of_birth, gender, blood_group, emergency_contact_name, emergency_contact_phone, address, medical_history_summary } = patientData;

    const existingUser = dbRepository.findUserByEmail(email);
    if (existingUser) {
      throw { statusCode: 400, message: 'An account with this email address already exists.' };
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password || 'password123', salt);

    const newUser = dbRepository.createUser({
      name,
      email,
      password_hash,
      role: 'PATIENT',
      phone: phone || '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
    });

    const newPatient = dbRepository.createPatient({
      user_id: newUser.id,
      date_of_birth: date_of_birth || '1990-01-01',
      gender: gender || 'OTHER',
      blood_group: blood_group || 'O+',
      emergency_contact_name: emergency_contact_name || '',
      emergency_contact_phone: emergency_contact_phone || '',
      address: address || '',
      medical_history_summary: medical_history_summary || 'No medical history provided.'
    });

    dbRepository.createAuditLog({
      user_id: newUser.id,
      action: 'PATIENT_REGISTERED',
      resource: 'Patient',
      resource_id: String(newPatient.id),
      details: `New patient account created for ${name} (${email}).`
    });

    return authService.login(email, password || 'password123');
  }
};

module.exports = authService;
