const dbRepository = require('../repositories/dbRepository');

const billingService = {
  getAllBills: (requestingUser) => {
    let bills = dbRepository.getAllBills();
    if (requestingUser.role === 'PATIENT') {
      const pat = dbRepository.getPatientByUserId(requestingUser.id);
      if (pat) bills = bills.filter(b => b.patient_id === pat.id);
    }
    return bills;
  },

  getBillById: (id) => dbRepository.getAllBills().find(b => Number(b.id) === Number(id)),

  getBillByAppointment: (apptId) => dbRepository.getBillByAppointment(apptId),

  createInvoiceForCompletedAppointment: (data, requestingUser) => {
    const { appointment_id, patient_id, consultation_fee, medication_fee, other_charges, discount } = data;

    const appt = dbRepository.getAppointmentById(appointment_id);
    if (!appt) throw { statusCode: 404, message: 'Appointment not found.' };

    if (appt.status !== 'COMPLETED') {
      throw { statusCode: 400, message: 'Billing can only be generated for COMPLETED consultations.' };
    }

    const existingBill = dbRepository.getBillByAppointment(appointment_id);
    if (existingBill) return existingBill;

    const cFee = Number(consultation_fee || 100);
    const mFee = Number(medication_fee || 0);
    const oCharges = Number(other_charges || 0);
    const disc = Number(discount || 0);
    const total = Math.max(0, cFee + mFee + oCharges - disc);

    const billNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBill = dbRepository.createBill({
      bill_number: billNumber,
      appointment_id: Number(appointment_id),
      patient_id: Number(patient_id),
      consultation_fee: cFee,
      medication_fee: mFee,
      other_charges: oCharges,
      discount: disc,
      total_amount: total,
      payment_status: 'PENDING',
      payment_method: 'CASH',
      paid_at: null
    });

    dbRepository.createAuditLog({
      user_id: requestingUser.id,
      action: 'GENERATE_INVOICE',
      resource: 'Bill',
      resource_id: String(newBill.id),
      details: `Invoice ${billNumber} generated for appointment #${appt.appointment_number} ($${total.toFixed(2)}).`
    });

    return newBill;
  },

  processPayment: (billId, paymentMethod, requestingUser) => {
    const bill = dbRepository.getBillByAppointment(billId) || dbRepository.getAllBills().find(b => Number(b.id) === Number(billId));
    if (!bill) throw { statusCode: 404, message: 'Bill invoice not found.' };

    if (bill.payment_status === 'PAID') {
      throw { statusCode: 400, message: 'Invoice is already paid in full.' };
    }

    const updatedBill = dbRepository.updateBill(bill.id, {
      payment_status: 'PAID',
      payment_method: paymentMethod || 'CREDIT_CARD',
      paid_at: new Date().toISOString()
    });

    dbRepository.createAuditLog({
      user_id: requestingUser.id,
      action: 'COLLECT_PAYMENT',
      resource: 'Bill',
      resource_id: String(bill.id),
      details: `Payment collected for Invoice #${bill.bill_number} via ${paymentMethod || 'CREDIT_CARD'}.`
    });

    return updatedBill;
  }
};

module.exports = billingService;
