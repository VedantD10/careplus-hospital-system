const dbRepository = require('../repositories/dbRepository');

const adminService = {
  getDashboardAnalytics: () => {
    const users = dbRepository.getAllUsers();
    const doctors = dbRepository.getAllDoctors();
    const patients = dbRepository.getAllPatients();
    const appointments = dbRepository.getAllAppointments();
    const bills = dbRepository.getAllBills();
    const departments = dbRepository.getAllDepartments();

    // Financial Metrics
    const totalRevenue = bills
      .filter(b => b.payment_status === 'PAID')
      .reduce((sum, b) => sum + Number(b.total_amount || 0), 0);

    const pendingRevenue = bills
      .filter(b => b.payment_status === 'PENDING')
      .reduce((sum, b) => sum + Number(b.total_amount || 0), 0);

    // Appointment Status Breakdown
    const apptStatusMap = {
      SCHEDULED: 0,
      CHECKED_IN: 0,
      IN_CONSULTATION: 0,
      COMPLETED: 0,
      CANCELLED: 0
    };
    appointments.forEach(a => {
      if (apptStatusMap[a.status] !== undefined) apptStatusMap[a.status]++;
    });

    // Doctor Workload Analytics
    const doctorWorkload = doctors.map(doc => {
      const docAppts = appointments.filter(a => a.doctor_id === doc.id);
      const completed = docAppts.filter(a => a.status === 'COMPLETED').length;
      return {
        id: doc.id,
        name: doc.name,
        specialization: doc.specialization,
        department_name: doc.department_name,
        totalAppointments: docAppts.length,
        completedConsultations: completed
      };
    });

    // Department Analytics
    const departmentAnalytics = departments.map(dept => {
      const deptAppts = appointments.filter(a => a.department_id === dept.id);
      const deptBills = bills.filter(b => {
        const appt = appointments.find(a => a.id === b.appointment_id);
        return appt && appt.department_id === dept.id && b.payment_status === 'PAID';
      });
      const revenue = deptBills.reduce((sum, b) => sum + Number(b.total_amount || 0), 0);

      return {
        id: dept.id,
        name: dept.name,
        code: dept.code,
        appointmentCount: deptAppts.length,
        revenue
      };
    });

    // Hospital Occupancy / Capacity metric (simulated active consultations vs capacity)
    const activeConsultations = appointments.filter(a => ['CHECKED_IN', 'IN_CONSULTATION'].includes(a.status)).length;
    const maxCapacity = 20; // 20 clinical rooms
    const occupancyRate = Math.round((activeConsultations / maxCapacity) * 100);

    return {
      summaryCards: {
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        totalAppointments: appointments.length,
        totalRevenue,
        pendingRevenue,
        occupancyRate
      },
      appointmentStatusBreakdown: apptStatusMap,
      doctorWorkload,
      departmentAnalytics,
      recentAppointments: appointments.slice(-6).reverse()
    };
  }
};

module.exports = adminService;
