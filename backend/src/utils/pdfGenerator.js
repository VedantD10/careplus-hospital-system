const dbRepository = require('../repositories/dbRepository');

const generatePrescriptionHTML = (medicalRecordId) => {
  const records = dbRepository.getAllAppointments();
  const rec = dbRepository.getMedicalRecordsByPatient(1).find(r => r.id === Number(medicalRecordId)) || dbRepository.getMedicalRecordByAppointment(medicalRecordId);

  if (!rec) return '<h1>Prescription Not Found</h1>';

  const appt = dbRepository.getAppointmentById(rec.appointment_id);
  const patient = dbRepository.getPatientById(rec.patient_id);
  const doctor = dbRepository.getDoctorById(rec.doctor_id);
  const rx = rec.prescription;

  const meds = rx ? (typeof rx.medications === 'string' ? JSON.parse(rx.medications) : rx.medications) : [];

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <title>Prescription #${rec.id} - CarePlus Hospital</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #1e293b; line-height: 1.5; }
      .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0d9488; padding-bottom: 15px; margin-bottom: 20px; }
      .brand { font-size: 24px; font-weight: bold; color: #0d9488; }
      .hospital-info { text-align: right; font-size: 13px; color: #64748b; }
      .section-title { font-size: 14px; font-weight: bold; color: #0f766e; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-top: 20px; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; font-size: 14px; }
      .med-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
      .med-table th { background-color: #f1f5f9; text-align: left; padding: 10px; font-size: 13px; color: #334155; border-bottom: 2px solid #cbd5e1; }
      .med-table td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
      .rx-symbol { font-size: 32px; font-weight: bold; color: #0d9488; margin: 15px 0 5px 0; }
      .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: justify; font-size: 12px; color: #94a3b8; }
      .sign-box { text-align: right; margin-top: 30px; }
      .sign-line { display: inline-block; width: 220px; border-top: 1px solid #475569; margin-top: 50px; text-align: center; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <div class="brand">🏥 CarePlus Multi-Specialty Hospital</div>
        <div style="font-size: 12px; color: #475569;">NABH Accredited Healthcare & Clinical Research Centre</div>
      </div>
      <div class="hospital-info">
        100 MG Road, Near Trinity Metro Station<br/>
        Bengaluru, Karnataka - 560001<br/>
        Phone: +91 80 4567 8900 | Email: contact@careplus-hospital.in
      </div>
    </div>

    <div class="grid">
      <div>
        <strong>Patient Name:</strong> ${patient ? patient.name : 'N/A'}<br/>
        <strong>Gender:</strong> ${patient ? patient.gender : 'N/A'}<br/>
        <strong>Blood Group:</strong> ${patient ? patient.blood_group : 'N/A'}
      </div>
      <div style="text-align: right;">
        <strong>Date:</strong> ${new Date(rec.created_at).toLocaleDateString('en-IN')}<br/>
        <strong>Doctor:</strong> ${doctor ? doctor.name : 'N/A'}<br/>
        <strong>Qualification:</strong> ${doctor ? doctor.qualification : 'N/A'}<br/>
        <strong>Reg No:</strong> KMC-REG-2012-9844
      </div>
    </div>

    <div class="section-title">Vitals & Clinical Summary</div>
    <div class="grid" style="margin-top: 10px;">
      <div><strong>BP:</strong> ${rec.vitals_bp} | <strong>Pulse:</strong> ${rec.vitals_pulse}</div>
      <div><strong>Temp:</strong> ${rec.vitals_temp} | <strong>Weight:</strong> ${rec.vitals_weight}</div>
    </div>
    <div style="font-size: 14px; margin-bottom: 10px;">
      <strong>Diagnosis:</strong> ${rec.diagnosis}
    </div>

    <div class="rx-symbol">℞</div>
    <table class="med-table">
      <thead>
        <tr>
          <th>Medication</th>
          <th>Dosage</th>
          <th>Frequency</th>
          <th>Duration</th>
          <th>Instructions</th>
        </tr>
      </thead>
      <tbody>
        ${meds.map(m => `
          <tr>
            <td><strong>${m.name}</strong></td>
            <td>${m.dosage}</td>
            <td>${m.frequency}</td>
            <td>${m.duration}</td>
            <td>${m.instructions}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    ${rx && rx.instructions ? `<div style="margin-top: 20px; font-size: 13px;"><strong>Doctor's Advice:</strong> ${rx.instructions}</div>` : ''}
    ${rx && rx.follow_up_date ? `<div style="margin-top: 10px; font-size: 13px; color: #0f766e;"><strong>Follow-up Date:</strong> ${rx.follow_up_date}</div>` : ''}

    <div class="sign-box">
      <div class="sign-line">
        ${doctor ? doctor.name : ''}<br/>
        Authorized Medical Practitioner
      </div>
    </div>

    <div class="footer">
      This digital prescription is electronically generated by CarePlus Hospital Management System. Valid across registered pharmacies in India.
    </div>
  </body>
  </html>
  `;
};

const generateInvoiceHTML = (billId) => {
  const bill = dbRepository.getAllBills().find(b => Number(b.id) === Number(billId)) || dbRepository.getBillByAppointment(billId);

  if (!bill) return '<h1>Invoice Not Found</h1>';

  const patient = dbRepository.getPatientById(bill.patient_id);
  const appt = dbRepository.getAppointmentById(bill.appointment_id);

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <title>Invoice ${bill.bill_number} - CarePlus Hospital</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #1e293b; line-height: 1.5; }
      .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f766e; padding-bottom: 15px; margin-bottom: 20px; }
      .brand { font-size: 24px; font-weight: bold; color: #0f766e; }
      .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
      .badge-paid { background-color: #dcfce7; color: #15803d; }
      .badge-pending { background-color: #fef3c7; color: #b45309; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; font-size: 14px; }
      .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      .table th { background-color: #f0fdf4; text-align: left; padding: 12px; font-size: 13px; color: #166534; border-bottom: 2px solid #bbf7d0; }
      .table td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
      .totals { margin-top: 20px; text-align: right; font-size: 14px; }
      .totals-row { display: flex; justify-content: flex-end; gap: 40px; padding: 5px 0; }
      .grand-total { font-size: 18px; font-weight: bold; color: #0f766e; border-top: 2px solid #0f766e; padding-top: 10px; margin-top: 10px; }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <div class="brand">🏥 CarePlus Multi-Specialty Hospital</div>
        <div style="font-size: 12px; color: #64748b;">Medical Accounts & Billing Division | GSTIN: 29AAAAA0000A1Z5</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 20px; font-weight: bold;">TAX INVOICE</div>
        <div style="color: #64748b; font-size: 14px;">#${bill.bill_number}</div>
        <div style="margin-top: 5px;">
          <span class="badge ${bill.payment_status === 'PAID' ? 'badge-paid' : 'badge-pending'}">${bill.payment_status}</span>
        </div>
      </div>
    </div>

    <div class="grid">
      <div>
        <strong>Billed To:</strong><br/>
        ${patient ? patient.name : 'N/A'}<br/>
        Email: ${patient ? patient.email : 'N/A'}<br/>
        Phone: ${patient ? patient.phone : 'N/A'}<br/>
        ${patient ? patient.address : ''}
      </div>
      <div style="text-align: right;">
        <strong>Invoice Date:</strong> ${new Date(bill.created_at).toLocaleDateString('en-IN')}<br/>
        <strong>Appointment Reference:</strong> ${appt ? appt.appointment_number : 'N/A'}<br/>
        <strong>Payment Method:</strong> ${bill.payment_method || 'N/A'}
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Department</th>
          <th style="text-align: right;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Medical Doctor Consultation Fee</td>
          <td>${appt ? appt.department_name : 'General'}</td>
          <td style="text-align: right;">₹${Number(bill.consultation_fee).toFixed(2)}</td>
        </tr>
        <tr>
          <td>Prescribed Pharmacy & Medication Charges</td>
          <td>CarePlus Pharmacy</td>
          <td style="text-align: right;">₹${Number(bill.medication_fee).toFixed(2)}</td>
        </tr>
        <tr>
          <td>Hospital Infrastructure & Facility Charges</td>
          <td>Clinical Operations</td>
          <td style="text-align: right;">₹${Number(bill.other_charges).toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Subtotal:</span>
        <strong>₹${(Number(bill.consultation_fee) + Number(bill.medication_fee) + Number(bill.other_charges)).toFixed(2)}</strong>
      </div>
      <div class="totals-row">
        <span>Discount:</span>
        <strong>-₹${Number(bill.discount).toFixed(2)}</strong>
      </div>
      <div class="totals-row grand-total">
        <span>Total Payable (INR):</span>
        <span>₹${Number(bill.total_amount).toFixed(2)}</span>
      </div>
    </div>

    <div style="margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 12px; color: #94a3b8; text-align: center;">
      Thank you for choosing CarePlus Hospital. For billing support, contact billing@careplus-hospital.in.
    </div>
  </body>
  </html>
  `;
};

module.exports = {
  generatePrescriptionHTML,
  generateInvoiceHTML
};
