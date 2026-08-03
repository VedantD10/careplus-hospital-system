const db = require('../config/db');

const dbRepository = {
  // Users
  findUserByEmail: (email) => db.findOneWhere('users', u => u.email.toLowerCase() === email.toLowerCase()),
  findUserById: (id) => db.findById('users', id),
  createUser: (userData) => db.insert('users', userData),
  updateUser: (id, updates) => db.update('users', id, updates),
  getAllUsers: () => db.query('users'),

  // Departments
  getAllDepartments: () => db.query('departments'),
  getDepartmentById: (id) => db.findById('departments', id),
  createDepartment: (dept) => db.insert('departments', dept),

  // Doctors
  getAllDoctors: () => {
    const doctors = db.query('doctors');
    const users = db.query('users');
    const departments = db.query('departments');
    return doctors.map(doc => {
      const user = users.find(u => u.id === doc.user_id) || {};
      const dept = departments.find(d => d.id === doc.department_id) || {};
      return {
        ...doc,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        department_name: dept.name,
        department_code: dept.code,
        consultation_fee: dept.consultation_fee
      };
    });
  },
  getDoctorById: (id) => {
    const doc = db.findById('doctors', id);
    if (!doc) return null;
    const user = db.findById('users', doc.user_id) || {};
    const dept = db.findById('departments', doc.department_id) || {};
    return {
      ...doc,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      department_name: dept.name,
      department_code: dept.code,
      consultation_fee: dept.consultation_fee
    };
  },
  getDoctorByUserId: (userId) => {
    const doc = db.findOneWhere('doctors', d => d.user_id === Number(userId));
    if (!doc) return null;
    return dbRepository.getDoctorById(doc.id);
  },

  // Patients
  getAllPatients: () => {
    const patients = db.query('patients');
    const users = db.query('users');
    return patients.map(pat => {
      const user = users.find(u => u.id === pat.user_id) || {};
      return {
        ...pat,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar
      };
    });
  },
  getPatientById: (id) => {
    const pat = db.findById('patients', id);
    if (!pat) return null;
    const user = db.findById('users', pat.user_id) || {};
    return {
      ...pat,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar
    };
  },
  getPatientByUserId: (userId) => {
    const pat = db.findOneWhere('patients', p => p.user_id === Number(userId));
    if (!pat) return null;
    return dbRepository.getPatientById(pat.id);
  },
  createPatient: (patientData) => db.insert('patients', patientData),

  // Doctor Schedules & Leaves
  getDoctorSchedules: (doctorId) => db.findWhere('doctor_schedules', s => Number(s.doctor_id) === Number(doctorId)),
  getDoctorLeaves: (doctorId) => db.findWhere('doctor_leaves', l => Number(l.doctor_id) === Number(doctorId)),
  addDoctorLeave: (leaveData) => db.insert('doctor_leaves', leaveData),

  // Appointments
  getAllAppointments: () => {
    const appointments = db.query('appointments');
    const patients = dbRepository.getAllPatients();
    const doctors = dbRepository.getAllDoctors();
    const departments = db.query('departments');

    return appointments.map(app => {
      const pat = patients.find(p => p.id === app.patient_id) || {};
      const doc = doctors.find(d => d.id === app.doctor_id) || {};
      const dept = departments.find(d => d.id === app.department_id) || {};
      return {
        ...app,
        patient_name: pat.name,
        patient_email: pat.email,
        patient_phone: pat.phone,
        doctor_name: doc.name,
        doctor_room: doc.room_number,
        doctor_specialization: doc.specialization,
        department_name: dept.name,
        department_code: dept.code
      };
    });
  },
  getAppointmentById: (id) => {
    const appts = dbRepository.getAllAppointments();
    return appts.find(a => Number(a.id) === Number(id)) || null;
  },
  getAppointmentsByPatient: (patientId) => {
    const appts = dbRepository.getAllAppointments();
    return appts.filter(a => Number(a.patient_id) === Number(patientId));
  },
  getAppointmentsByDoctor: (doctorId) => {
    const appts = dbRepository.getAllAppointments();
    return appts.filter(a => Number(a.doctor_id) === Number(doctorId));
  },
  createAppointment: (apptData) => db.insert('appointments', apptData),
  updateAppointment: (id, updates) => db.update('appointments', id, updates),

  // Medical Records & Prescriptions
  getMedicalRecordByAppointment: (apptId) => {
    const record = db.findOneWhere('medical_records', r => Number(r.appointment_id) === Number(apptId));
    if (!record) return null;
    const rx = db.findOneWhere('prescriptions', p => Number(p.medical_record_id) === Number(record.id));
    return {
      ...record,
      prescription: rx ? { ...rx, medications: JSON.parse(rx.medications_json || '[]') } : null
    };
  },
  getMedicalRecordsByPatient: (patientId) => {
    const records = db.findWhere('medical_records', r => Number(r.patient_id) === Number(patientId));
    return records.map(record => {
      const rx = db.findOneWhere('prescriptions', p => Number(p.medical_record_id) === Number(record.id));
      const doc = dbRepository.getDoctorById(record.doctor_id);
      return {
        ...record,
        doctor_name: doc ? doc.name : 'Unknown Doctor',
        prescription: rx ? { ...rx, medications: JSON.parse(rx.medications_json || '[]') } : null
      };
    });
  },
  createMedicalRecord: (recData) => db.insert('medical_records', recData),
  createPrescription: (rxData) => db.insert('prescriptions', rxData),

  // Bills
  getBillByAppointment: (apptId) => db.findOneWhere('bills', b => Number(b.appointment_id) === Number(apptId)),
  getBillsByPatient: (patientId) => db.findWhere('bills', b => Number(b.patient_id) === Number(patientId)),
  getAllBills: () => {
    const bills = db.query('bills');
    const patients = dbRepository.getAllPatients();
    return bills.map(b => {
      const pat = patients.find(p => p.id === b.patient_id) || {};
      return {
        ...b,
        patient_name: pat.name,
        patient_email: pat.email
      };
    });
  },
  createBill: (billData) => db.insert('bills', billData),
  updateBill: (id, updates) => db.update('bills', id, updates),

  // Notifications
  getNotificationsByUser: (userId) => db.findWhere('notifications', n => Number(n.user_id) === Number(userId)),
  createNotification: (notif) => db.insert('notifications', notif),
  markNotificationRead: (id) => db.update('notifications', id, { is_read: 1 }),

  // Audit Logs
  getAllAuditLogs: () => {
    const logs = db.query('audit_logs');
    const users = db.query('users');
    return logs.map(log => {
      const u = users.find(usr => usr.id === log.user_id) || {};
      return {
        ...log,
        user_name: u.name || 'System / Guest',
        user_role: u.role || 'N/A'
      };
    });
  },
  createAuditLog: (logData) => db.insert('audit_logs', logData),

  // 500-Bed Operational Tables
  getAllBeds: () => db.query('beds'),
  updateBedStatus: (id, updates) => db.update('beds', id, updates),

  getAllInsuranceClaims: () => db.query('insurance_claims'),
  updateInsuranceClaim: (id, updates) => db.update('insurance_claims', id, updates),

  getAllLabResults: () => db.query('lab_results'),
  getAllSurgeries: () => db.query('surgeries'),
  getAllLiveIncidents: () => db.query('live_incidents'),
  
  // Enterprise Workflows
  getPatientFullProfile: (patientId) => {
    const pat = dbRepository.getPatientById(patientId);
    if (!pat) return null;
    const appts = dbRepository.getAppointmentsByPatient(patientId);
    const records = dbRepository.getMedicalRecordsByPatient(patientId);
    const bills = dbRepository.getBillsByPatient(patientId);
    const insurance = db.findWhere('insurance_claims', c => c.patient_name === pat.name || c.mrn === pat.mrn);
    const beds = db.findWhere('beds', b => b.patient_name === pat.name);
    const logs = db.findWhere('audit_logs', l => String(l.details || '').includes(pat.name) || String(l.details || '').includes(pat.mrn));

    return {
      ...pat,
      appointments: appts,
      medical_records: records,
      bills: bills,
      insurance_claims: insurance,
      bed_history: beds,
      audit_logs: logs
    };
  },

  getAllRosterSwaps: () => db.query('roster_swaps') || [
    { id: 1, requesting_doctor: 'Dr. Vikram Malhotra', target_doctor: 'Dr. Ananya Iyer', shift_date: '2026-08-08', shift_type: 'NIGHT_DUTY', reason: 'Emergency Surgery Coverage', status: 'PENDING' },
    { id: 2, requesting_doctor: 'Dr. Suresh Reddy', target_doctor: 'Dr. Vikram Malhotra', shift_date: '2026-08-12', shift_type: 'MORNING_OPD', reason: 'CME Workshop Attendance', status: 'APPROVED' }
  ],

  createRosterSwap: (swap) => db.insert('roster_swaps', swap),
  updateRosterSwap: (id, updates) => db.update('roster_swaps', id, updates)
};

module.exports = dbRepository;
