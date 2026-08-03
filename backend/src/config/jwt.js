module = module || {};
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'careplus_hospital_super_secret_jwt_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h'
};
