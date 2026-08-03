# CarePlus Enterprise Hospital Information System (HIS)

![CarePlus HIS Banner](https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200&h=400)

## Executive Project Overview

**CarePlus Enterprise HIS** is a mission-critical, full-stack Hospital Information System engineered for a **500-bed multi-specialty acute care healthcare facility**. 

The system digitizes patient operations, clinical workflows, OPD consultation queues, bed occupancy management, TPA health insurance pre-authorizations, operation theatre (OT) surgical schedules, and post-consultation billing.

Designed for high-density operational workflows, CarePlus HIS replaces decorative dashboard widgets with actionable workspaces modeled after industry-standard healthcare platforms such as **Epic Systems**, **Oracle Health (Cerner)**, and **ServiceNow Healthcare**.

---

## 1. Problem Understanding & Client Brief

CarePlus Hospital faced major operational bottlenecks due to manual paper-based processes and disconnected tools:
- **Patient Delays**: Long waiting times caused by manual appointment coordination across OPD rooms.
- **Fragmented Records**: Scattered paper medical records making patient history retrieval slow for attending doctors.
- **Billing Errors**: Separate billing desks creating pricing discrepancies and delayed payments.
- **Oversight Gaps**: Management lacked real-time visibility into bed occupancy, doctor workload, and TPA pre-authorization clearances.

### The Solution
A centralized web-based platform with strict **Role-Based Access Control (RBAC)** connecting Administrators, Medical Specialists (Doctors), Receptionists, and Patients.

---

## 2. System Architecture & Tech Stack

```
                                  ┌─────────────────────────────┐
                                  │   React 18 Frontend SPA     │
                                  │  (Tailwind CSS, Lucide-React│
                                  │   Enterprise Data Tables)   │
                                  └──────────────┬──────────────┘
                                                 │ REST APIs (JWT Auth)
                                  ┌──────────────▼──────────────┐
                                  │    Node.js / Express.js     │
                                  │   Backend Microservices     │
                                  └──────────────┬──────────────┘
                                                 │ SQL Queries
                                  ┌──────────────▼──────────────┐
                                  │ MySQL Relational Database   │
                                  │  (Normalized 12+ Tables)    │
                                  └─────────────────────────────┘
```

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide-React, Context API state management.
- **Backend**: Node.js, Express.js, JWT (JSON Web Tokens), bcryptjs password hashing.
- **Database**: Relational Normalized MySQL Schema (with standalone fallback Memory/JSON repository for local zero-config execution).
- **Deployment**: Frontend deployable on Vercel, Backend on Render, Database on Railway.

---

## 3. Stakeholder Roles & Key Responsibilities

### 🛡️ Administrator (Hospital Command Center)
- **500-Bed Allocation Grid**: Monitor and reallocate beds across Cardiac ICU, Neuro ICU, General Wards, and Trauma ER.
- **TPA Insurance Pre-Auth Ledger**: Review and approve health insurance claims submitted by TPA partners (Star Health, HDFC ERGO, ICICI Lombard).
- **Surgery & OT Schedule**: Oversight of active surgical suites (OT 1 to OT 6).
- **Doctor Roster Swaps**: Approve or reject duty shift swap requests submitted by doctors.
- **System Audit Logs**: Access immutable audit trail tracking all clinical access events.

### 🩺 Doctor (Clinical Workstation)
- **Waiting Room Queue**: View real-time checked-in patients waiting in assigned OPD rooms.
- **EMR Consultation Launcher**: Record vital signs (BP, Pulse, Temp), clinical symptoms, ICD-10 diagnoses, and treatment plans.
- **Digital Prescription Issuer**: Issue structured medication regimens with dosage, frequency, and instructions.
- **Doctor Leave & Roster Swaps**: Schedule unavailability dates or request shift coverage from peers.

### 📋 Receptionist (Admissions & Reception Desk)
- **Patient Arrival Check-In**: Mark scheduled patients as checked-in to trigger doctor queue updates.
- **Appointment Booking Engine**: Schedule appointments with real-time slot conflict detection and doctor leave checks.
- **Cashier Billing Desk**: Collect consultation fees, generate post-consultation invoices, and print receipts.

### 👤 Patient (Patient Health Portal)
- **Self-Service Booking**: Book OPD consultations with specialist doctors.
- **Prescriptions & PDF Downloads**: Access past diagnoses and print official prescription documents.
- **Billing Ledger**: View fee breakdown and payment status.

---

## 4. Key Business Logic Rules & Constraints

1. **Conflict Prevention**: Prevents double-booking doctor slots or booking during approved doctor leave.
2. **Post-Consultation Billing**: Invoices are generated only after completed consultations. Cancelled appointments cannot be billed.
3. **Medical Record Confidentiality**: Confidential clinical notes are restricted to treating doctors and administrators. Receptionists cannot view diagnostic notes.
4. **Patient Record Scope**: Doctors can edit records only for patients under their active treatment.
5. **MRN Standard**: Unique Medical Record Numbers (`MRN-2026-8801`) are consistently linked across appointments, beds, prescriptions, and billing.

---

## 5. Database Schema (`schema.sql`)

The system relies on a normalized relational schema:

```sql
-- Core Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT') NOT NULL,
    phone VARCHAR(50),
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments Table
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    head_doctor_name VARCHAR(255),
    consultation_fee DECIMAL(10,2) NOT NULL DEFAULT 1000.00
);

-- Doctors Table
CREATE TABLE doctors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT FOREIGN KEY REFERENCES users(id),
    department_id INT FOREIGN KEY REFERENCES departments(id),
    qualification VARCHAR(255),
    specialization VARCHAR(255),
    experience_years INT,
    room_number VARCHAR(50),
    is_active TINYINT DEFAULT 1
);

-- Patients Table
CREATE TABLE patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT FOREIGN KEY REFERENCES users(id),
    mrn VARCHAR(50) UNIQUE NOT NULL,
    date_of_birth DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    blood_group VARCHAR(10),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    address TEXT,
    medical_history_summary TEXT,
    current_bed VARCHAR(50),
    triage_level VARCHAR(50)
);

-- Appointments Table
CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id INT FOREIGN KEY REFERENCES patients(id),
    doctor_id INT FOREIGN KEY REFERENCES doctors(id),
    department_id INT FOREIGN KEY REFERENCES departments(id),
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('SCHEDULED', 'CHECKED_IN', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED') DEFAULT 'SCHEDULED',
    reason TEXT
);

-- Additional Tables: medical_records, prescriptions, bills, beds, insurance_claims, surgeries, audit_logs
```

---

## 6. Installation & Local Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Step 1: Clone Repository
```bash
git clone https://github.com/careplus/careplus-hospital-system.git
cd careplus-hospital-system
```

### Step 2: Setup & Start Backend Server
```bash
cd backend
npm install
npm start
```
*Backend server runs on `http://localhost:5000` with pre-seeded demo data.*

### Step 3: Setup & Start Frontend Application
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Frontend dev server runs on `http://localhost:5173`.*

---

## 7. Demo Login Credentials

| Role | Email | Password | Access Dashboard |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@careplus.com` | `password123` | `/admin` |
| **Doctor** | `vikram.malhotra@careplus.com` | `password123` | `/doctor-dashboard` |
| **Receptionist** | `reception@careplus.com` | `password123` | `/reception-dashboard` |
| **Patient** | `patient@careplus.com` | `password123` | `/patient-dashboard` |

---

## 8. Deployment Setup

- **Frontend**: Connect repository to **Vercel**, set root directory to `frontend`, build command `npm run build`, output directory `dist`.
- **Backend**: Deploy `backend` directory to **Render** Web Service with build command `npm install` and start command `node src/app.js`.
- **Environment Variables**:
  - `PORT=5000`
  - `JWT_SECRET=careplus_super_secret_jwt_key_2026`
  - `NODE_ENV=production`

---

## 9. Assumptions & Future Enhancements

### Assumptions
- Emergency cases bypass routine OPD scheduling and are directly assigned to ER bays.
- TPA pre-authorizations simulate Indian health insurance workflows (Star Health, HDFC ERGO).

### Future Enhancements
- Integration with HL7 FHIR interoperability standards for external laboratory equipment syncing.
- Telemedicine video consultation integration via WebRTC.

---

## License
Developed under the **VESA Skill Development Program**. Designed & built for **CarePlus Hospital**.
