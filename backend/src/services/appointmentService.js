const dbRepository = require('../repositories/dbRepository');

const appointmentService = {
  getAppointments: (filters = {}, user) => {
    let appts = dbRepository.getAllAppointments();

    if (user.role === 'PATIENT') {
      const pat = dbRepository.getPatientByUserId(user.id);
      if (pat) appts = appts.filter(a => a.patient_id === pat.id);
    } else if (user.role === 'DOCTOR') {
      const doc = dbRepository.getDoctorByUserId(user.id);
      if (doc) appts = appts.filter(a => a.doctor_id === doc.id);
    }

    if (filters.status) {
      appts = appts.filter(a => a.status === filters.status);
    }
    if (filters.date) {
      appts = appts.filter(a => a.appointment_date === filters.date);
    }
    if (filters.doctorId) {
      appts = appts.filter(a => Number(a.doctor_id) === Number(filters.doctorId));
    }
    if (filters.patientId) {
      appts = appts.filter(a => Number(a.patient_id) === Number(filters.patientId));
    }

    // Sort by date and start_time ascending
    return appts.sort((a, b) => {
      const dtA = new Date(`${a.appointment_date}T${a.start_time}`);
      const dtB = new Date(`${b.appointment_date}T${b.start_time}`);
      return dtA - dtB;
    });
  },

  checkConflict: (doctorId, dateStr, startTime, endTime, excludeApptId = null) => {
    const leaves = dbRepository.getDoctorLeaves(doctorId);
    const apptDate = new Date(dateStr);

    const isOnLeave = leaves.some(l => {
      if (l.status !== 'APPROVED') return false;
      const s = new Date(l.start_date);
      const e = new Date(l.end_date);
      return apptDate >= s && apptDate <= e;
    });

    if (isOnLeave) {
      return { hasConflict: true, reason: 'Doctor is unavailable on leave during this date.' };
    }

    const existingAppts = dbRepository.getAllAppointments().filter(a => {
      if (Number(a.doctor_id) !== Number(doctorId)) return false;
      if (a.appointment_date !== dateStr) return false;
      if (['CANCELLED', 'NO_SHOW'].includes(a.status)) return false;
      if (excludeApptId && Number(a.id) === Number(excludeApptId)) return false;
      return true;
    });

    for (const a of existingAppts) {
      if (startTime < a.end_time && endTime > a.start_time) {
        return {
          hasConflict: true,
          reason: `Doctor already has a booked appointment (${a.start_time.substring(0,5)} - ${a.end_time.substring(0,5)})`
        };
      }
    }

    return { hasConflict: false };
  },

  createAppointment: (data, requestingUser) => {
    let { patient_id, doctor_id, appointment_date, start_time, end_time, reason } = data;

    if (requestingUser.role === 'PATIENT') {
      const pat = dbRepository.getPatientByUserId(requestingUser.id);
      if (!pat) throw { statusCode: 400, message: 'Patient profile missing.' };
      patient_id = pat.id;
    }

    const doc = dbRepository.getDoctorById(doctor_id);
    if (!doc) throw { statusCode: 404, message: 'Doctor not found.' };

    if (!end_time) {
      const [h, m] = start_time.split(':').map(Number);
      const endM = m + 30;
      const endH = h + Math.floor(endM / 60);
      const remM = endM % 60;
      end_time = `${String(endH).padStart(2, '0')}:${String(remM).padStart(2, '0')}:00`;
    }

    // Check Conflict
    const conflict = appointmentService.checkConflict(doctor_id, appointment_date, start_time, end_time);
    if (conflict.hasConflict) {
      throw { statusCode: 409, message: conflict.reason };
    }

    const apptNum = `CP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppt = dbRepository.createAppointment({
      appointment_number: apptNum,
      patient_id: Number(patient_id),
      doctor_id: Number(doctor_id),
      department_id: Number(doc.department_id),
      appointment_date,
      start_time: start_time.length === 5 ? `${start_time}:00` : start_time,
      end_time: end_time.length === 5 ? `${end_time}:00` : end_time,
      status: 'SCHEDULED',
      reason: reason || 'General Consultation'
    });

    const patObj = dbRepository.getPatientById(patient_id);
    if (doc.user_id) {
      dbRepository.createNotification({
        user_id: doc.user_id,
        title: 'New Appointment Scheduled',
        message: `Patient ${patObj ? patObj.name : ''} booked an appointment for ${appointment_date} at ${start_time}.`,
        type: 'APPOINTMENT'
      });
    }

    dbRepository.createAuditLog({
      user_id: requestingUser.id,
      action: 'BOOK_APPOINTMENT',
      resource: 'Appointment',
      resource_id: String(newAppt.id),
      details: `Appointment #${apptNum} booked for patient ID ${patient_id} with Dr. ${doc.name}.`
    });

    return dbRepository.getAppointmentById(newAppt.id);
  },

  updateStatus: (apptId, status, cancellationReason, user) => {
    const appt = dbRepository.getAppointmentById(apptId);
    if (!appt) throw { statusCode: 404, message: 'Appointment not found.' };

    const validStatuses = ['SCHEDULED', 'CHECKED_IN', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
    if (!validStatuses.includes(status)) {
      throw { statusCode: 400, message: 'Invalid appointment status.' };
    }

    const updates = { status };
    if (status === 'CANCELLED' && cancellationReason) {
      updates.cancellation_reason = cancellationReason;
    }

    const updated = dbRepository.updateAppointment(apptId, updates);

    dbRepository.createAuditLog({
      user_id: user.id,
      action: 'UPDATE_APPOINTMENT_STATUS',
      resource: 'Appointment',
      resource_id: String(apptId),
      details: `Appointment #${appt.appointment_number} status changed from ${appt.status} to ${status}.`
    });

    return dbRepository.getAppointmentById(apptId);
  }
};

module.exports = appointmentService;
