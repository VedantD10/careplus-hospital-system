const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'CarePlus Enterprise Hospital Information System',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRoutes);

// Serve Frontend Production Dist Build
const distPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(distPath));

// SPA Catch-All Fallback
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// 404 Handler for API
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use(errorHandler);

if (require.main === module) {
  // Bind without host parameter so Node listens on dual-stack IPv4 + IPv6 (::)
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🏥 CarePlus Enterprise HIS running on http://localhost:${PORT}`);
    console.log(`🏥 Also accessible at http://127.0.0.1:${PORT}`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
