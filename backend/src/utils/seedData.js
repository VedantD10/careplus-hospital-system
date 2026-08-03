const bcrypt = require('bcryptjs');

const getInitialSeedData = () => {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('password123', salt);

  const users = [
    {
      id: 1,
      name: 'Dr. Rajesh Sharma (Admin)',
      email: 'admin@careplus.com',
      password_hash: passwordHash,
      role: 'ADMIN',
      phone: '+91 98100 12345',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200',
      created_at: new Date('2026-01-10').toISOString()
    },
    {
      id: 2,
      name: 'Dr. Vikram Malhotra',
      email: 'vikram.malhotra@careplus.com',
      password_hash: passwordHash,
      role: 'DOCTOR',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
      created_at: new Date('2026-01-12').toISOString()
    },
    {
      id: 3,
      name: 'Dr. Ananya Iyer',
      email: 'ananya.iyer@careplus.com',
      password_hash: passwordHash,
      role: 'DOCTOR',
      phone: '+91 98450 67890',
      avatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78905?auto=format&fit=crop&q=80&w=200',
      created_at: new Date('2026-01-14').toISOString()
    },
    {
      id: 4,
      name: 'Dr. Suresh Reddy',
      email: 'suresh.reddy@careplus.com',
      password_hash: passwordHash,
      role: 'DOCTOR',
      phone: '+91 97110 55443',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
      created_at: new Date('2026-01-15').toISOString()
    },
    {
      id: 5,
      name: 'Priya Deshmukh',
      email: 'reception@careplus.com',
      password_hash: passwordHash,
      role: 'RECEPTIONIST',
      phone: '+91 99200 88776',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      created_at: new Date('2026-01-16').toISOString()
    },
    {
      id: 6,
      name: 'Aarav Verma',
      email: 'patient@careplus.com',
      password_hash: passwordHash,
      role: 'PATIENT',
      phone: '+91 98210 33445',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      created_at: new Date('2026-01-20').toISOString()
    },
    {
      id: 7,
      name: 'Sunita Rao',
      email: 'sunita.rao@gmail.com',
      password_hash: passwordHash,
      role: 'PATIENT',
      phone: '+91 98990 11223',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      created_at: new Date('2026-01-22').toISOString()
    },
    {
      id: 8,
      name: 'Rajesh Gupta',
      email: 'rajesh.gupta@yahoo.co.in',
      password_hash: passwordHash,
      role: 'PATIENT',
      phone: '+91 97170 66778',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      created_at: new Date('2026-01-25').toISOString()
    }
  ];

  const departments = [
    { id: 1, name: 'Cardiology', code: 'CARD', description: 'Comprehensive cardiac care, angioplasty, and vascular surgery unit.', head_doctor_name: 'Dr. Vikram Malhotra', consultation_fee: 1000.00 },
    { id: 2, name: 'Neurology', code: 'NEUR', description: 'Advanced brain, spine, and stroke management department.', head_doctor_name: 'Dr. Ananya Iyer', consultation_fee: 1200.00 },
    { id: 3, name: 'Pediatrics', code: 'PED', description: 'Child health, pediatric immunology, and neonatal care clinic.', head_doctor_name: 'Dr. Suresh Reddy', consultation_fee: 800.00 },
    { id: 4, name: 'Orthopedics', code: 'ORTH', description: 'Joint replacement, trauma care, and bone fracture management.', head_doctor_name: 'Dr. Vikram Malhotra', consultation_fee: 900.00 },
    { id: 5, name: 'General Medicine', code: 'GEN', description: 'Primary health screening, fever management, and internal medicine.', head_doctor_name: 'Dr. Ananya Iyer', consultation_fee: 600.00 },
    { id: 6, name: 'Emergency & Triage', code: 'ER', description: '24x7 Emergency trauma care and critical resuscitation unit.', head_doctor_name: 'Dr. Rajesh Sharma', consultation_fee: 1500.00 }
  ];

  const doctors = [
    {
      id: 1,
      user_id: 2,
      department_id: 1,
      qualification: 'MBBS, MD (General Medicine), DM (Cardiology) - AIIMS New Delhi',
      specialization: 'Interventional Cardiology',
      experience_years: 15,
      bio: 'Senior Interventional Cardiologist with extensive experience in coronary stenting and pacemaker implantations.',
      room_number: 'OPD Room 302',
      is_active: 1
    },
    {
      id: 2,
      user_id: 3,
      department_id: 2,
      qualification: 'MBBS, DNB (Neurology) - Christian Medical College (CMC Vellore)',
      specialization: 'Clinical Neurophysiology & Epilepsy',
      experience_years: 12,
      bio: 'Consultant Neurologist specializing in migraine treatment, stroke management, and epilepsy care.',
      room_number: 'OPD Room 405',
      is_active: 1
    },
    {
      id: 3,
      user_id: 4,
      department_id: 3,
      qualification: 'MBBS, MD (Pediatrics) - Grant Medical College & JJ Hospital Mumbai',
      specialization: 'Pediatric Care & Allergy',
      experience_years: 9,
      bio: 'Pediatric specialist dedicated to infant immunization, growth tracking, and pediatric respiratory conditions.',
      room_number: 'OPD Room 108',
      is_active: 1
    }
  ];

  const patients = [
    {
      id: 1,
      user_id: 6,
      mrn: 'MRN-2026-8801',
      date_of_birth: '1988-04-12',
      gender: 'MALE',
      blood_group: 'O+',
      emergency_contact_name: 'Meera Verma (Wife)',
      emergency_contact_phone: '+91 98210 99887',
      address: 'Flat 402, Shanthi Apartments, Indiranagar 100ft Road, Bengaluru, Karnataka - 560038',
      medical_history_summary: 'Hypertension under management since 2022. No drug allergies.',
      current_bed: 'ICU-B04',
      triage_level: 'Level 2 (Urgent)'
    },
    {
      id: 2,
      user_id: 7,
      mrn: 'MRN-2026-8802',
      date_of_birth: '1995-09-24',
      gender: 'FEMALE',
      blood_group: 'A+',
      emergency_contact_name: 'Rohan Rao (Brother)',
      emergency_contact_phone: '+91 98990 33445',
      address: 'House No 12, 4th Main, Malleshwaram, Bengaluru, Karnataka - 560003',
      medical_history_summary: 'History of seasonal allergy and migraine headaches.',
      current_bed: 'WARD-3A-12',
      triage_level: 'Level 4 (Standard)'
    },
    {
      id: 3,
      user_id: 8,
      mrn: 'MRN-2026-8803',
      date_of_birth: '1976-11-05',
      gender: 'MALE',
      blood_group: 'B+',
      emergency_contact_name: 'Kavita Gupta (Daughter)',
      emergency_contact_phone: '+91 97170 11223',
      address: 'B-45, Sector 62, Noida, Uttar Pradesh - 201301',
      medical_history_summary: 'Type 2 Diabetes Mellitus managed with Metformin 500mg.',
      current_bed: 'ER-BAY-02',
      triage_level: 'Level 3 (Semi-Urgent)'
    }
  ];

  const beds = [
    { id: 'ICU-B01', ward: 'Cardiac ICU', bed_number: 'B01', status: 'OCCUPIED', patient_name: 'Suresh Menon', doctor_name: 'Dr. Vikram Malhotra', admitted_at: '2026-08-02 14:30' },
    { id: 'ICU-B02', ward: 'Cardiac ICU', bed_number: 'B02', status: 'AVAILABLE', patient_name: null, doctor_name: null, admitted_at: null },
    { id: 'ICU-B03', ward: 'Cardiac ICU', bed_number: 'B03', status: 'OCCUPIED', patient_name: 'Anita Sharma', doctor_name: 'Dr. Vikram Malhotra', admitted_at: '2026-08-03 08:15' },
    { id: 'ICU-B04', ward: 'Neuro ICU', bed_number: 'B04', status: 'OCCUPIED', patient_name: 'Aarav Verma', doctor_name: 'Dr. Ananya Iyer', admitted_at: '2026-08-03 09:10' },
    { id: 'WARD-3A-12', ward: 'General Ward 3A', bed_number: 'A12', status: 'OCCUPIED', patient_name: 'Sunita Rao', doctor_name: 'Dr. Ananya Iyer', admitted_at: '2026-08-02 11:00' },
    { id: 'WARD-3A-14', ward: 'General Ward 3A', bed_number: 'A14', status: 'AVAILABLE', patient_name: null, doctor_name: null, admitted_at: null },
    { id: 'ER-BAY-01', ward: 'Trauma ER', bed_number: 'BAY-01', status: 'OCCUPIED', patient_name: 'Ramesh Patel', doctor_name: 'Dr. Rajesh Sharma', admitted_at: '2026-08-03 10:20' },
    { id: 'ER-BAY-02', ward: 'Trauma ER', bed_number: 'BAY-02', status: 'OCCUPIED', patient_name: 'Rajesh Gupta', doctor_name: 'Dr. Suresh Reddy', admitted_at: '2026-08-03 09:45' }
  ];

  const insurance_claims = [
    {
      id: 1,
      claim_number: 'TPA-2026-9901',
      patient_name: 'Aarav Verma',
      mrn: 'MRN-2026-8801',
      provider: 'Star Health & Allied Insurance',
      policy_number: 'SH-8849-2026',
      claimed_amount: 85000.00,
      approved_amount: 80000.00,
      status: 'APPROVED',
      submitted_at: '2026-08-02 10:15:00'
    },
    {
      id: 2,
      claim_number: 'TPA-2026-9902',
      patient_name: 'Sunita Rao',
      mrn: 'MRN-2026-8802',
      provider: 'HDFC ERGO Health Insurance',
      policy_number: 'HE-3391-2025',
      claimed_amount: 45000.00,
      approved_amount: 0.00,
      status: 'PENDING_APPROVAL',
      submitted_at: '2026-08-03 09:30:00'
    },
    {
      id: 3,
      claim_number: 'TPA-2026-9903',
      patient_name: 'Rajesh Gupta',
      mrn: 'MRN-2026-8803',
      provider: 'ICICI Lombard Health',
      policy_number: 'IL-5541-2026',
      claimed_amount: 62000.00,
      approved_amount: 62000.00,
      status: 'PRE_AUTH_GRANTED',
      submitted_at: '2026-08-03 10:05:00'
    }
  ];

  const lab_results = [
    {
      id: 1,
      mrn: 'MRN-2026-8801',
      patient_name: 'Aarav Verma',
      test_name: 'Troponin I High Sensitivity & 12-Lead ECG',
      department: 'Cardiology Diagnostics',
      status: 'COMPLETED',
      result_summary: 'Troponin I: 0.02 ng/mL (Normal). ECG shows sinus rhythm with no ST elevation.',
      pathologist: 'Dr. Arvind Kulkarni (MD Path)',
      performed_at: '2026-08-03 08:30:00'
    },
    {
      id: 2,
      mrn: 'MRN-2026-8802',
      patient_name: 'Sunita Rao',
      test_name: 'MRI Brain (Contrast) & EEG Protocol',
      department: 'Neuroradiology',
      status: 'PENDING_SIGNOFF',
      result_summary: 'MRI Brain scan completed. Awaiting final radiologist signoff.',
      pathologist: 'Dr. Nalini Swamy (MD Radiology)',
      performed_at: '2026-08-03 10:00:00'
    }
  ];

  const surgeries = [
    {
      id: 1,
      case_number: 'OT-2026-401',
      patient_name: 'Aarav Verma',
      mrn: 'MRN-2026-8801',
      procedure: 'Diagnostic Coronary Angiography (CAG)',
      primary_surgeon: 'Dr. Vikram Malhotra',
      anesthetist: 'Dr. Priya Nair (MD Anesthesia)',
      ot_room: 'OT Suite 2 (Cath Lab)',
      scheduled_time: '2026-08-04 10:00:00',
      status: 'CLEARED_FOR_SURGERY'
    },
    {
      id: 2,
      case_number: 'OT-2026-402',
      patient_name: 'Ketan Shah',
      mrn: 'MRN-2026-8890',
      procedure: 'Arthroscopic Knee Reconstruction',
      primary_surgeon: 'Dr. Vikram Malhotra',
      anesthetist: 'Dr. Priya Nair',
      ot_room: 'OT Suite 1',
      scheduled_time: '2026-08-04 14:30:00',
      status: 'PENDING_ANESTHESIA_CLEARANCE'
    }
  ];

  const live_incidents = [
    { id: 1, type: 'CRITICAL', title: 'ER Trauma Arrival', description: 'Level 1 Trauma patient arriving via ambulance. Emergency Bay 01 cleared.', timestamp: '2 mins ago' },
    { id: 2, type: 'ALERT', title: 'TPA Pre-Auth Pending', description: 'HDFC ERGO pre-auth claim #TPA-2026-9902 requires hospital admin signoff.', timestamp: '5 mins ago' },
    { id: 3, type: 'INFO', title: 'Cath Lab Maintenance', description: 'Scheduled bi-weekly calibration of Cath Lab Angiography Unit completed.', timestamp: '20 mins ago' }
  ];

  const doctor_schedules = [
    { id: 1, doctor_id: 1, day_of_week: 1, start_time: '09:00:00', end_time: '17:00:00', slot_duration_mins: 30 },
    { id: 2, doctor_id: 1, day_of_week: 2, start_time: '09:00:00', end_time: '17:00:00', slot_duration_mins: 30 },
    { id: 3, doctor_id: 1, day_of_week: 3, start_time: '09:00:00', end_time: '17:00:00', slot_duration_mins: 30 },
    { id: 4, doctor_id: 1, day_of_week: 4, start_time: '09:00:00', end_time: '17:00:00', slot_duration_mins: 30 },
    { id: 5, doctor_id: 1, day_of_week: 5, start_time: '09:00:00', end_time: '13:00:00', slot_duration_mins: 30 },
    { id: 6, doctor_id: 2, day_of_week: 1, start_time: '10:00:00', end_time: '18:00:00', slot_duration_mins: 30 },
    { id: 7, doctor_id: 2, day_of_week: 3, start_time: '10:00:00', end_time: '18:00:00', slot_duration_mins: 30 },
    { id: 8, doctor_id: 2, day_of_week: 5, start_time: '10:00:00', end_time: '18:00:00', slot_duration_mins: 30 },
    { id: 9, doctor_id: 3, day_of_week: 2, start_time: '08:30:00', end_time: '16:30:00', slot_duration_mins: 30 },
    { id: 10, doctor_id: 3, day_of_week: 4, start_time: '08:30:00', end_time: '16:30:00', slot_duration_mins: 30 }
  ];

  const doctor_leaves = [
    {
      id: 1,
      doctor_id: 2,
      start_date: '2026-08-15',
      end_date: '2026-08-18',
      reason: 'Attending Indian Academy of Neurology Conference in Hyderabad',
      status: 'APPROVED'
    }
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  const appointments = [
    {
      id: 1,
      appointment_number: 'CP-2026-0801',
      patient_id: 1,
      doctor_id: 1,
      department_id: 1,
      appointment_date: '2026-08-01',
      start_time: '10:00:00',
      end_time: '10:30:00',
      status: 'COMPLETED',
      reason: 'Routine cardiac health review and blood pressure check.',
      created_at: new Date('2026-07-28').toISOString()
    },
    {
      id: 2,
      appointment_number: 'CP-2026-0802',
      patient_id: 2,
      doctor_id: 2,
      department_id: 2,
      appointment_date: '2026-08-02',
      start_time: '11:30:00',
      end_time: '12:00:00',
      status: 'COMPLETED',
      reason: 'Recurrent headache and dizziness consultation.',
      created_at: new Date('2026-07-29').toISOString()
    },
    {
      id: 3,
      appointment_number: 'CP-2026-0803',
      patient_id: 1,
      doctor_id: 1,
      department_id: 1,
      appointment_date: todayStr,
      start_time: '09:30:00',
      end_time: '10:00:00',
      status: 'CHECKED_IN',
      reason: 'ECG report evaluation and medication adjustment.',
      created_at: new Date('2026-08-02').toISOString()
    },
    {
      id: 4,
      appointment_number: 'CP-2026-0804',
      patient_id: 3,
      doctor_id: 3,
      department_id: 3,
      appointment_date: todayStr,
      start_time: '14:00:00',
      end_time: '14:30:00',
      status: 'SCHEDULED',
      reason: 'Child immunization schedule review.',
      created_at: new Date('2026-08-02').toISOString()
    },
    {
      id: 5,
      appointment_number: 'CP-2026-0805',
      patient_id: 2,
      doctor_id: 1,
      department_id: 1,
      appointment_date: '2026-08-10',
      start_time: '11:00:00',
      end_time: '11:30:00',
      status: 'SCHEDULED',
      reason: 'Echocardiogram preliminary screening.',
      created_at: new Date('2026-08-03').toISOString()
    }
  ];

  const medical_records = [
    {
      id: 1,
      appointment_id: 1,
      patient_id: 1,
      doctor_id: 1,
      vitals_bp: '130/84 mmHg',
      vitals_pulse: '76 bpm',
      vitals_temp: '98.4 °F',
      vitals_weight: '74 kg',
      symptoms: 'Mild exertional chest tightness for past 10 days.',
      diagnosis: 'Stage 1 Essential Hypertension, Mild Angina.',
      treatment_plan: 'Start Telmisartan 40mg once daily. Reduce dietary salt intake. Repeat ECG in 1 month.',
      confidential_notes: 'Patient reports high work stress. ECG normal.',
      created_at: new Date('2026-08-01T10:35:00').toISOString()
    },
    {
      id: 2,
      appointment_id: 2,
      patient_id: 2,
      doctor_id: 2,
      vitals_bp: '118/76 mmHg',
      vitals_pulse: '70 bpm',
      vitals_temp: '98.6 °F',
      vitals_weight: '58 kg',
      symptoms: 'Throbbing right-sided headache accompanied by nausea.',
      diagnosis: 'Episodic Migraine without Aura.',
      treatment_plan: 'Naproxen 500mg SOS at onset. Maintain regular sleep log.',
      confidential_notes: 'Stress and irregular food intake identified as triggers.',
      created_at: new Date('2026-08-02T12:05:00').toISOString()
    }
  ];

  const prescriptions = [
    {
      id: 1,
      medical_record_id: 1,
      patient_id: 1,
      doctor_id: 1,
      medications_json: JSON.stringify([
        { name: 'Telmisartan 40mg', dosage: '1 Tablet', frequency: 'Once Daily (Morning)', duration: '30 Days', instructions: 'Take after breakfast with water.' },
        { name: 'Aspirin 75mg', dosage: '1 Tablet', frequency: 'Once Daily (Night)', duration: '30 Days', instructions: 'Take after dinner.' }
      ]),
      instructions: 'Avoid extra salt in food. Walk 30 minutes daily.',
      follow_up_date: '2026-09-01',
      created_at: new Date('2026-08-01T10:40:00').toISOString()
    },
    {
      id: 2,
      medical_record_id: 2,
      patient_id: 2,
      doctor_id: 2,
      medications_json: JSON.stringify([
        { name: 'Naproxen 500mg', dosage: '1 Tablet', frequency: 'As Needed (SOS)', duration: '10 Tablets', instructions: 'Take immediately at onset of headache.' },
        { name: 'Pantoprazole 40mg', dosage: '1 Tablet', frequency: 'Once Daily', duration: '10 Days', instructions: 'Take on empty stomach.' }
      ]),
      instructions: 'Stay hydrated and maintain consistent sleep times.',
      follow_up_date: '2026-09-15',
      created_at: new Date('2026-08-02T12:10:00').toISOString()
    }
  ];

  const bills = [
    {
      id: 1,
      bill_number: 'INV-2026-001',
      appointment_id: 1,
      patient_id: 1,
      consultation_fee: 1000.00,
      medication_fee: 350.00,
      other_charges: 150.00,
      discount: 100.00,
      total_amount: 1400.00,
      payment_status: 'PAID',
      payment_method: 'ONLINE',
      paid_at: new Date('2026-08-01T11:00:00').toISOString(),
      created_at: new Date('2026-08-01T10:45:00').toISOString()
    },
    {
      id: 2,
      bill_number: 'INV-2026-002',
      appointment_id: 2,
      patient_id: 2,
      consultation_fee: 1200.00,
      medication_fee: 280.00,
      other_charges: 0.00,
      discount: 0.00,
      total_amount: 1480.00,
      payment_status: 'PENDING',
      payment_method: 'CASH',
      paid_at: null,
      created_at: new Date('2026-08-02T12:15:00').toISOString()
    }
  ];

  const notifications = [
    {
      id: 1,
      user_id: 6,
      title: 'Appointment Reminder',
      message: 'Your Cardiology consultation with Dr. Vikram Malhotra is scheduled today at 09:30 AM.',
      type: 'APPOINTMENT',
      is_read: 0,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      user_id: 2,
      title: 'Patient Checked In',
      message: 'Aarav Verma has checked in at reception for appointment #CP-2026-0803.',
      type: 'CHECKIN',
      is_read: 0,
      created_at: new Date().toISOString()
    }
  ];

  const audit_logs = [
    {
      id: 1,
      user_id: 5,
      action: 'PATIENT_CHECKIN',
      resource: 'Appointment',
      resource_id: '3',
      ip_address: '192.168.1.45',
      details: 'Receptionist Priya Deshmukh checked in patient Aarav Verma for appointment #CP-2026-0803.',
      created_at: new Date('2026-08-03T09:15:00').toISOString()
    },
    {
      id: 2,
      user_id: 2,
      action: 'CREATE_MEDICAL_RECORD',
      resource: 'MedicalRecord',
      resource_id: '1',
      ip_address: '192.168.1.12',
      details: 'Dr. Vikram Malhotra submitted diagnosis & prescription for appointment #CP-2026-0801.',
      created_at: new Date('2026-08-01T10:35:00').toISOString()
    },
    {
      id: 3,
      user_id: 1,
      action: 'SYSTEM_CONFIG',
      resource: 'Department',
      resource_id: '1',
      ip_address: '192.168.1.2',
      details: 'Admin Dr. Rajesh Sharma updated consultation fee for Cardiology to ₹1,000.00.',
      created_at: new Date('2026-07-25T14:20:00').toISOString()
    }
  ];

  return {
    users,
    departments,
    doctors,
    patients,
    beds,
    insurance_claims,
    lab_results,
    surgeries,
    live_incidents,
    doctor_schedules,
    doctor_leaves,
    appointments,
    medical_records,
    prescriptions,
    bills,
    notifications,
    audit_logs
  };
};

module.exports = {
  getInitialSeedData
};
