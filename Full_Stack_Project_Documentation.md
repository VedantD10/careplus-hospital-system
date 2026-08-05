# Full Stack Project Documentation
## CarePlus Enterprise Hospital Information System (HIS)

---

### **Document Control**

| Parameter | Details |
| :--- | :--- |
| **Project Title** | CarePlus Enterprise Hospital Information System (HIS) |
| **Client Name** | CarePlus Hospital (500-Bed Acute Care Facility) |
| **Prepared For** | VESA Skill Development Program |
| **Document Version** | 1.0.0 (Production Release) |
| **Date** | August 5, 2026 |
| **Status** | Final Verified Documentation |

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Understanding of Client Requirements](#2-understanding-of-client-requirements)
- [3. System Architecture & Workflows](#3-system-architecture--workflows)
- [4. Technologies Used](#4-technologies-used)
- [5. Database Design & Relational Schema](#5-database-design--relational-schema)
- [6. Complete REST API Specifications](#6-complete-rest-api-specifications)
- [7. Comprehensive Folder Structure](#7-comprehensive-folder-structure)
- [8. Application Screenshots & UI Captions](#8-application-screenshots--ui-captions)
- [9. Features Implementation Matrix](#9-features-implementation-matrix)
- [10. Security & Compliance Architecture](#10-security--compliance-architecture)
- [11. Technical Challenges & Engineering Solutions](#11-technical-challenges--engineering-solutions)
- [12. Future Improvement Roadmap](#12-future-improvement-roadmap)
- [13. Conclusion & Production Readiness](#13-conclusion--production-readiness)

---

## 1. Project Overview

### 1.1 Purpose & Objective
The **CarePlus Enterprise Hospital Information System (HIS)** is a web-based healthcare operational platform built to digitize, streamline, and integrate clinical and administrative operations across a **500-bed acute care hospital facility**. 

The primary objective is to replace manual paper records, fragmented spreadsheets, and slow OPD queues with an integrated, high-density digital workspace connecting Administrators, Medical Doctors, Receptionists, and Patients.

### 1.2 Hospital Problem Statement
Before implementation, CarePlus Hospital suffered from operational inefficiencies:
- **Long Patient Wait Times**: Manual registration desks created bottlenecks and delayed OPD consultation scheduling.
- **Fragmented Medical Records**: Paper charts made past diagnostic histories difficult for attending doctors to quickly access.
- **Billing Discrepancies**: Disconnected cashier desks caused pricing discrepancies between consultation, pharmacy, and laboratory fees.
- **Resource Oversight Deficit**: Hospital administration lacked real-time visibility into bed occupancy across ICUs, TPA insurance pre-authorizations, OT surgical suites, and doctor shift coverage.

### 1.3 Proposed & Implemented Solution
A multi-role web platform utilizing a modern React 18 Single Page Application (SPA) frontend, an Express.js REST API micro-backend, and a normalized MySQL relational schema. The platform provides role-tailored high-density workspaces for all 4 primary hospital stakeholders:

1. **Hospital Command Center (Admin)**: 500-Bed allocation matrix, TPA insurance ledger, OT surgical suite tracker, doctor roster swap approvals, and HIPAA audit trails.
2. **Clinical Workstation (Doctor)**: Checked-in patient queue, EMR consultation launcher (vitals, symptoms, ICD-10 diagnoses), and structured digital prescription generation.
3. **Admissions & Cashier Desk (Receptionist)**: Patient arrival check-in, real-time appointment conflict checking, and post-consultation cashier billing.
4. **Patient Portal (Patient)**: OPD consultation booking, prescription PDF downloads, and billing history tracking.

---

## 2. Understanding of Client Requirements

### 2.1 Requirements Mapping Table

| Requirement ID | Requirement Description | Implemented Status | Codebase File Location | Technical Notes |
| :---: | :--- | :---: | :--- | :--- |
| **REQ-01** | Multi-Role JWT Authentication & Role Switching | ✅ Implemented | `backend/src/middleware/auth.js`<br>`frontend/src/context/AuthContext.jsx` | BCrypt hashing, JWT tokens with 24h expiry, role claims for ADMIN, DOCTOR, RECEPTIONIST, PATIENT. |
| **REQ-02** | Department Management & Fee Matrix | ✅ Implemented | `backend/src/controllers/adminController.js`<br>`frontend/src/pages/DepartmentsPage.jsx` | Department codes (CARD, NEUR, PED, ORTH, GEN, ER) with consultation rates. |
| **REQ-03** | Appointment Scheduling & Conflict Prevention | ✅ Implemented | `backend/src/services/appointmentService.js`<br>`frontend/src/pages/AppointmentsPage.jsx` | Prevents double-booking doctor slots and checks active doctor leave schedules. |
| **REQ-04** | Patient Arrival Desk & OPD Queue | ✅ Implemented | `frontend/src/pages/dashboards/ReceptionistDashboard.jsx` | One-click arrival check-in updating doctor waiting queue in real time. |
| **REQ-05** | EMR Diagnoses & Digital Prescriptions | ✅ Implemented | `backend/src/controllers/medicalRecordController.js`<br>`frontend/src/pages/dashboards/DoctorDashboard.jsx` | Captures vitals (BP, Pulse, Temp), symptoms, ICD-10 diagnoses, and medication regimens. |
| **REQ-06** | Post-Consultation Invoicing & Billing | ✅ Implemented | `backend/src/services/billingService.js`<br>`frontend/src/pages/BillingPage.jsx` | Generates invoices strictly after appointment completion. Prevents billing cancelled cases. |
| **REQ-07** | 500-Bed Allocation Grid & Ward Transfers | ✅ Implemented | `frontend/src/components/common/BedOccupancyGrid.jsx`<br>`frontend/src/components/common/BedTransferModal.jsx` | Interactive bed matrix for Cardiac ICU, Neuro ICU, General Ward, and Emergency Bays. |
| **REQ-08** | TPA Insurance Pre-Authorization Ledger | ✅ Implemented | `frontend/src/pages/dashboards/AdminDashboard.jsx` | Approval/rejection ledger for Star Health, HDFC ERGO, ICICI Lombard insurance claims. |
| **REQ-09** | Immutable Security Audit Trail | ✅ Implemented | `backend/src/repositories/dbRepository.js`<br>`frontend/src/pages/AuditLogsPage.jsx` | Records user IP address, timestamp, action event, and resource mutation IDs. |
| **REQ-10** | Document PDF Generation & Printing | ✅ Implemented | `frontend/src/components/common/PrintDocumentModal.jsx` | Clean print view with CarePlus letterhead, official seal, and print-ready CSS. |
| **REQ-11** | Universal Filter Bar & Data Export | ✅ Implemented | `frontend/src/components/common/FilterBar.jsx`<br>`frontend/src/components/common/EnterpriseDataTable.jsx` | Multi-facet filtering, CSV export, expandable rows, and pagination. |

---

## 3. System Architecture & Workflows

### 3.1 High-Level Architecture Diagram

```
+-----------------------------------+
|     React 18 SPA Frontend / Vite  |
+-----------------------------------+
                  | HTTPS REST / JSON
+-----------------------------------+
|  Express.js REST API Microservice |
+-----------------------------------+
                  | SQL Queries
+-----------------------------------+
| MySQL Relational Database (12 Tab)|
+-----------------------------------+
```

---

## 4. Technologies Used

| Category | Technology | Version | Engineering Justification |
| :--- | :--- | :---: | :--- |
| **Frontend Framework** | React | `18.3.1` | Component-driven UI architecture, fast virtual DOM rendering, and efficient hook-based state management. |
| **Build Tool** | Vite | `5.4.21` | Near-instant hot module replacement (HMR), optimized production asset chunking, and fast bundle generation. |
| **Styling Engine** | Tailwind CSS | `3.4.1` | Utility-first CSS providing cohesive design tokens, responsive breakpoints, and custom healthcare color palettes. |
| **UI Iconography** | Lucide React | `0.344.0` | High-density SVG icons formatted for clinical dashboards and enterprise tables. |
| **Backend Runtime** | Node.js | `v22.14.0` | Asynchronous non-blocking event loop suitable for concurrent API requests. |
| **Server Framework** | Express.js | `4.19.2` | Minimalist web application framework providing flexible routing and middleware pipelines. |
| **Authentication** | JSON Web Tokens (JWT) | `9.0.2` | Stateless, secret-signed bearer token authentication containing encrypted user identity and role claims. |
| **Password Security** | BcryptJS | `2.4.3` | One-way password hashing algorithm with salt rounds protecting against dictionary attacks. |
| **Database Engine** | MySQL / InnoDB | `8.0+` | ACID-compliant relational database engine enforcing primary keys, foreign key constraints, and cascading rules. |
| **Deployment Platform** | Vercel | Cloud | Global CDN serverless deployment utilizing `api/index.js` functions and static SPA rewrites. |

---

## 5. Database Design & Relational Schema

The CarePlus relational database schema is defined in `schema.sql` and normalized up to **Third Normal Form (3NF)** across 12 relational tables.

```
+------------------+       +------------------+       +------------------+
|      users       |       |   departments    |       |     doctors      |
+------------------+       +------------------+       +------------------+
| PK id            |<------| PK id            |<------| PK id            |
|    email (UNIQUE)|       |    code (UNIQUE) |       | FK user_id       |
|    role          |       +------------------+       | FK department_id |
+------------------+                                  +------------------+
         |                                                     |
         v                                                     v
+------------------+                                  +------------------+
|     patients     |                                  |   appointments   |
+------------------+                                  +------------------+
| PK id            |<---------------------------------| PK id            |
| FK user_id       |                                  | FK patient_id    |
|    mrn (UNIQUE)  |                                  | FK doctor_id     |
+------------------+                                  | FK department_id |
         |                                            +------------------+
         |                                                     |
         +------------------------+----------------------------+
                                  |
                                  v
                       +----------------------+
                       |   medical_records    |
                       +----------------------+
                       | PK id                |
                       | FK appointment_id    |
                       | FK patient_id        |
                       | FK doctor_id         |
                       +----------------------+
                                  |
                                  v
                       +----------------------+
                       |    prescriptions     |
                       +----------------------+
                       | PK id                |
                       | FK medical_record_id |
                       +----------------------+
```

---

## 6. Complete REST API Specifications

All API endpoints are prefixed with `/api` and defined in `backend/src/routes/apiRoutes.js`.

### 6.1 Authentication API Group
- **`POST /api/auth/register`**: Register new patient or staff accounts.
- **`POST /api/auth/login`**: Authenticate user and issue JWT bearer token.
- **`GET /api/auth/me`**: Fetch current authenticated profile.

### 6.2 Patient & Doctor API Group
- **`GET /api/patients`**: Retrieve patient directory with MRN search and pagination.
- **`GET /api/patients/:id/full-profile`**: Fetch 360-degree clinical profile.
- **`GET /api/doctors`**: List specialist doctors filtered by department.

### 6.3 Appointment API Group
- **`GET /api/appointments`**: List appointments filtered by date, doctor, or status.
- **`POST /api/appointments`**: Create new appointment with real-time conflict checking.
- **`PATCH /api/appointments/:id/check-in`**: Receptionist patient arrival check-in.
- **`PATCH /api/appointments/:id/cancel`**: Cancel appointment slot.

### 6.4 Medical Records & Billing API Group
- **`POST /api/medical-records`**: Log EMR consultation diagnosis, vitals, and issue prescriptions.
- **`GET /api/bills`**: Retrieve financial cashier ledger.
- **`POST /api/bills/generate`**: Issue invoice for completed appointment.
- **`PATCH /api/bills/:id/pay`**: Mark invoice payment as `PAID`.

---

## 7. Comprehensive Folder Structure

```
careplus-hospital-system/
├── api/                        # Vercel Serverless Entrypoint (api/index.js)
├── backend/                    # Node.js Express REST Backend Microservice
│   ├── package.json            # Node backend dependencies & start scripts
│   └── src/
│       ├── app.js              # Express app bootstrap & static asset middleware
│       ├── config/             # DB & JWT configurations
│       ├── constants/          # Role & status enums
│       ├── controllers/        # Request validation & HTTP response handlers
│       ├── middleware/         # Auth, Error & Logger middleware
│       ├── repositories/       # Data repository layer
│       ├── routes/             # REST route definitions
│       ├── services/           # Core domain business logic engines
│       └── utils/              # PDF Generator & seed data
├── frontend/                   # React 18 + Vite Web Application
│   ├── index.html              # HTML5 template
│   ├── package.json            # React frontend dependencies & build scripts
│   ├── vite.config.js          # Vite server & proxy configuration
│   ├── vercel.json             # Frontend SPA rewrite rules
│   └── src/
│       ├── main.jsx            # React root mount with ErrorBoundary
│       ├── App.jsx             # React Router DOM navigation tree
│       ├── index.css           # Tailwind CSS design system
│       ├── components/         # Reusable UI component library
│       ├── context/            # Auth & Notification State Management
│       ├── pages/              # Stakeholder Workspaces & Route Views
│       └── services/           # Universal fetch HTTP client
├── vercel.json                 # Root Vercel build & route configuration
├── schema.sql                  # MySQL database creation script
└── README.md                   # Technical project overview & documentation
```

---

## 8. Features Implementation Matrix

| Module / Feature | Implementation Status | Implemented Functionality Details |
| :--- | :---: | :--- |
| **JWT Authentication** | ✅ Implemented | Hashed passwords, JWT token generation, 24-hour expiration, client token storage. |
| **Role-Based Access Control** | ✅ Implemented | Server-side `requireRole()` middleware and client route guards (`allowedRoles`). |
| **OPD Appointment Scheduling** | ✅ Implemented | Doctor slot selection, department filtering, booking reason capture. |
| **Slot Conflict Prevention** | ✅ Implemented | Server-side validation preventing overlapping bookings for the same doctor. |
| **Doctor Unavailability Checks** | ✅ Implemented | Blocks appointment booking during approved doctor leave dates. |
| **Arrival Desk Check-In** | ✅ Implemented | One-click status update (`CHECKED_IN`) advancing patient into doctor queue. |
| **EMR Diagnoses & Notes** | ✅ Implemented | Captures Blood Pressure, Pulse, Temp, symptoms, and ICD-10 diagnostic text. |
| **Digital Prescriptions** | ✅ Implemented | Multi-drug prescription regimens with dosage, frequency, and instructions. |
| **Post-Consultation Invoicing** | ✅ Implemented | Invoices generated strictly after consultation completion. |
| **500-Bed Allocation Grid** | ✅ Implemented | Interactive ward matrix for Cardiac ICU, Neuro ICU, General Ward, and ER. |
| **Bed Transfer Reallocation** | ✅ Implemented | Reallocates patient bed assignments with real-time bed count updates. |
| **TPA Insurance Approval Ledger** | ✅ Implemented | Admin review and pre-authorization approval for health insurance claims. |
| **Doctor Roster Shift Swaps** | ✅ Implemented | Peer shift swap submission and administrative approval workflow. |
| **Security Audit Trail** | ✅ Implemented | Records user actions, IP addresses, resource targets, and timestamps. |
| **Printable PDF Documents** | ✅ Implemented | Official print preview overlay with CarePlus letterhead and CSS print layout. |
| **Multi-Facet Search & Filter** | ✅ Implemented | Search by name/MRN, department, status, priority, and date range. |
| **CSV Data Export** | ✅ Implemented | Client-side CSV generation across all enterprise data tables. |
| **Command Palette (`Ctrl+K`)** | ✅ Implemented | Global search shortcut for jumping to patient MRNs and modules. |
| **SMS Gateway Integration** | ❌ Not Implemented | *Planned for future production release.* |
| **Telemedicine Video Call** | ❌ Not Implemented | *Planned for future production release.* |

---

## 9. Conclusion & Production Readiness

The **CarePlus Enterprise Hospital Information System (HIS)** successfully addresses the core operational challenges of CarePlus Hospital. 

With **100% of mandatory project requirements verified**, a normalized 12-table relational database schema, clean layered microservice backend architecture, and optimized cloud deployment configurations (`vercel.json`), the system is **production-ready** for enterprise deployment.
