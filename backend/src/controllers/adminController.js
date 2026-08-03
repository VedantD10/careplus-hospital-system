const adminService = require('../services/adminService');
const dbRepository = require('../repositories/dbRepository');

const adminController = {
  getAnalytics: async (req, res, next) => {
    try {
      const analytics = adminService.getDashboardAnalytics();
      res.json(analytics);
    } catch (err) {
      next(err);
    }
  },

  getAuditLogs: async (req, res, next) => {
    try {
      const logs = dbRepository.getAllAuditLogs();
      res.json(logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (err) {
      next(err);
    }
  },

  getDepartments: async (req, res, next) => {
    try {
      res.json(dbRepository.getAllDepartments());
    } catch (err) {
      next(err);
    }
  },

  createDepartment: async (req, res, next) => {
    try {
      const newDept = dbRepository.createDepartment(req.body);
      dbRepository.createAuditLog({
        user_id: req.user.id,
        action: 'CREATE_DEPARTMENT',
        resource: 'Department',
        resource_id: String(newDept.id),
        details: `Department ${newDept.name} created by Admin.`
      });
      res.status(201).json(newDept);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = adminController;
