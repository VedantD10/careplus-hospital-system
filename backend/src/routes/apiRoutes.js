const express = require('express');
const router = express.Router();

const { authenticateToken, requireRole } = require('../middleware/auth');
const authController = require('../controllers/authController');
const appointmentController = require('../controllers/appointmentController');
const medicalRecordController = require('../controllers/medicalRecordController');
const billingController = require('../controllers/billingController');
const adminController = require('../controllers/adminController');
const doctorController = require('../controllers/doctorController');
const dbRepository = require('../repositories/dbRepository');

// --- AUTH ROUTES ---
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.get('/auth/me', authenticateToken, authController.getCurrentUser);

// --- DOCTOR ROUTES ---
router.get('/doctors', doctorController.getAllDoctors);
router.get('/doctors/:id', doctorController.getDoctorById);
router.get('/doctors/:id/schedule', doctorController.getSchedule);
router.post('/doctors/:id/leave', authenticateToken, requireRole(['DOCTOR', 'ADMIN']), doctorController.addLeave);

// --- PATIENT ROUTES ---
router.get('/patients', authenticateToken, requireRole(['ADMIN', 'RECEPTIONIST', 'DOCTOR']), (req, res) => {
  res.json(dbRepository.getAllPatients());
});
router.get('/patients/:id', authenticateToken, (req, res) => {
  const patient = dbRepository.getPatientById(req.params.id);
  if (!patient) return res.status(404).json({ error: 'Patient not found.' });
  res.json(patient);
});

// --- APPOINTMENT ROUTES ---
router.get('/appointments', authenticateToken, appointmentController.getAppointments);
router.get('/appointments/check-conflict', appointmentController.checkConflict);
router.get('/appointments/:id', authenticateToken, appointmentController.getAppointmentById);
router.post('/appointments', authenticateToken, appointmentController.bookAppointment);
router.patch('/appointments/:id/status', authenticateToken, appointmentController.updateStatus);

// --- MEDICAL RECORD & PRESCRIPTION ROUTES ---
router.get('/medical-records/appointment/:appointmentId', authenticateToken, medicalRecordController.getByAppointment);
router.get('/medical-records/patient/:patientId', authenticateToken, medicalRecordController.getPatientHistory);
router.post('/medical-records', authenticateToken, requireRole(['DOCTOR', 'ADMIN']), medicalRecordController.createRecord);
router.get('/medical-records/:recordId/pdf', medicalRecordController.downloadPrescriptionPDF);

// --- BILLING & INVOICE ROUTES ---
router.get('/bills', authenticateToken, billingController.getAllBills);
router.get('/bills/:id', authenticateToken, billingController.getBillById);
router.post('/bills/:id/pay', authenticateToken, billingController.payBill);
router.get('/bills/:id/pdf', billingController.downloadInvoicePDF);

// --- ADMIN & ANALYTICS ROUTES ---
router.get('/admin/analytics', authenticateToken, requireRole(['ADMIN']), adminController.getAnalytics);
router.get('/admin/audit-logs', authenticateToken, requireRole(['ADMIN']), adminController.getAuditLogs);
router.get('/departments', adminController.getDepartments);
router.post('/departments', authenticateToken, requireRole(['ADMIN']), adminController.createDepartment);

// --- NOTIFICATIONS ---
router.get('/notifications', authenticateToken, (req, res) => {
  res.json(dbRepository.getNotificationsByUser(req.user.id));
});
router.patch('/notifications/:id/read', authenticateToken, (req, res) => {
  res.json(dbRepository.markNotificationRead(req.params.id));
});

// --- 500-BED HIS OPERATIONAL WORKSPACE ENDPOINTS ---
router.get('/beds', authenticateToken, (req, res) => {
  res.json(dbRepository.getAllBeds());
});
router.patch('/beds/:id', authenticateToken, requireRole(['ADMIN', 'RECEPTIONIST', 'DOCTOR']), (req, res) => {
  const updated = dbRepository.updateBedStatus(req.params.id, req.body);
  dbRepository.createAuditLog({
    user_id: req.user.id,
    action: 'BED_TRANSFER',
    resource: 'Bed',
    resource_id: String(req.params.id),
    details: `Bed ${req.params.id} updated: Patient ${req.body.patient_name || 'Unassigned'}, status ${req.body.status}.`
  });
  res.json(updated);
});

router.get('/insurance-claims', authenticateToken, (req, res) => {
  res.json(dbRepository.getAllInsuranceClaims());
});
router.patch('/insurance-claims/:id', authenticateToken, requireRole(['ADMIN', 'RECEPTIONIST']), (req, res) => {
  const updated = dbRepository.updateInsuranceClaim(req.params.id, req.body);
  dbRepository.createAuditLog({
    user_id: req.user.id,
    action: 'INSURANCE_APPROVAL',
    resource: 'InsuranceClaim',
    resource_id: String(req.params.id),
    details: `TPA Claim #${req.params.id} updated status to ${req.body.status} (Approved ₹${req.body.approved_amount || 0}).`
  });
  res.json(updated);
});

router.get('/lab-results', authenticateToken, (req, res) => {
  res.json(dbRepository.getAllLabResults());
});

router.get('/surgeries', authenticateToken, (req, res) => {
  res.json(dbRepository.getAllSurgeries());
});

router.get('/incidents', authenticateToken, (req, res) => {
  res.json(dbRepository.getAllLiveIncidents());
});

router.get('/patients/:id/full-profile', authenticateToken, (req, res) => {
  const profile = dbRepository.getPatientFullProfile(req.params.id);
  if (!profile) return res.status(404).json({ error: 'Patient profile not found.' });
  res.json(profile);
});

router.get('/roster-swaps', authenticateToken, (req, res) => {
  res.json(dbRepository.getAllRosterSwaps());
});

router.post('/roster-swaps', authenticateToken, requireRole(['DOCTOR', 'ADMIN']), (req, res) => {
  const newSwap = dbRepository.createRosterSwap(req.body);
  dbRepository.createAuditLog({
    user_id: req.user.id,
    action: 'ROSTER_SWAP_REQUEST',
    resource: 'RosterSwap',
    resource_id: String(newSwap.id),
    details: `Doctor roster swap requested for ${req.body.shift_date} (${req.body.shift_type}).`
  });
  res.status(201).json(newSwap);
});

router.patch('/roster-swaps/:id', authenticateToken, requireRole(['ADMIN', 'DOCTOR']), (req, res) => {
  const updated = dbRepository.updateRosterSwap(req.params.id, req.body);
  dbRepository.createAuditLog({
    user_id: req.user.id,
    action: 'ROSTER_SWAP_APPROVAL',
    resource: 'RosterSwap',
    resource_id: String(req.params.id),
    details: `Roster swap #${req.params.id} updated status to ${req.body.status}.`
  });
  res.json(updated);
});

module.exports = router;
