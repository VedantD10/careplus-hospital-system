const dbRepository = require('../repositories/dbRepository');
const appointmentService = require('./appointmentService');
const billingService = require('./billingService');

const medicalRecordService = {
  getRecordByAppointment: (apptId, requestingUser) => {
    const record = dbRepository.getMedicalRecordByAppointment(apptId);

    if (record && requestingUser.role === 'RECEPTIONIST') {
      delete record.confidential_notes;
      delete record.symptoms;
      delete record.diagnosis;
    }

    return record;
  },

  getPatientHistory: (patientId, requestingUser) => {
    let records = dbRepository.getMedicalRecordsByPatient(patientId);

    if (requestingUser.role === 'RECEPTIONIST') {
      records = records.map(r => {
        const { confidential_notes, symptoms, diagnosis, ...rest } = r;
        return rest;
      });
    }

    return records;
  },

  createRecordWithPrescription: (data, requestingUser) => {
    const { appointment_id, vitals_bp, vitals_pulse, vitals_temp, vitals_weight, symptoms, diagnosis, treatment_plan, confidential_notes, medications, instructions, follow_up_date } = data;

    const appt = dbRepository.getAppointmentById(appointment_id);
    if (!appt) throw { statusCode: 404, message: 'Appointment not found.' };

    const doc = dbRepository.getDoctorByUserId(requestingUser.id);
    if (requestingUser.role === 'DOCTOR' && doc && Number(doc.id) !== Number(appt.doctor_id)) {
      throw { statusCode: 403, message: 'Doctors can only record diagnoses for patients assigned to them.' };
    }

    const existingRecord = dbRepository.getMedicalRecordByAppointment(appointment_id);
    if (existingRecord) {
      throw { statusCode: 400, message: 'Medical record already created for this appointment.' };
    }

    const record = dbRepository.createMedicalRecord({
      appointment_id: Number(appointment_id),
      patient_id: appt.patient_id,
      doctor_id: appt.doctor_id,
      vitals_bp: vitals_bp || '120/80 mmHg',
      vitals_pulse: vitals_pulse || '72 bpm',
      vitals_temp: vitals_temp || '98.6 °F',
      vitals_weight: vitals_weight || '70 kg',
      symptoms: symptoms || 'General Checkup',
      diagnosis: diagnosis || 'Under Observation',
      treatment_plan: treatment_plan || '',
      confidential_notes: confidential_notes || ''
    });

    let rx = null;
    let medicationTotalCost = 0;

    if (medications && Array.isArray(medications) && medications.length > 0) {
      rx = dbRepository.createPrescription({
        medical_record_id: record.id,
        patient_id: appt.patient_id,
        doctor_id: appt.doctor_id,
        medications_json: JSON.stringify(medications),
        instructions: instructions || 'Take medications as directed.',
        follow_up_date: follow_up_date || null
      });

      medicationTotalCost = medications.length * 18.50;
    }

    // Automatically transition appointment status to COMPLETED
    appointmentService.updateStatus(appointment_id, 'COMPLETED', null, requestingUser);

    // Automatically generate invoice
    const dept = dbRepository.getDepartmentById(appt.department_id);
    const consultationFee = dept ? Number(dept.consultation_fee) : 100.00;

    billingService.createInvoiceForCompletedAppointment({
      appointment_id: appt.id,
      patient_id: appt.patient_id,
      consultation_fee: consultationFee,
      medication_fee: medicationTotalCost,
      other_charges: 10.00,
      discount: 0.00
    }, requestingUser);

    dbRepository.createAuditLog({
      user_id: requestingUser.id,
      action: 'CREATE_MEDICAL_RECORD',
      resource: 'MedicalRecord',
      resource_id: String(record.id),
      details: `Medical record & prescription created for appointment #${appt.appointment_number}.`
    });

    return {
      record,
      prescription: rx
    };
  }
};

module.exports = medicalRecordService;
