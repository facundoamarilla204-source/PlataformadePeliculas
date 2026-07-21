const express = require('express');
const router = express.Router();
const { getDashboardStats, recordSiteView } = require('../controllers/dashboardController');

// GET /api/dashboard/stats
router.get('/stats', getDashboardStats);
// POST /api/dashboard/visit
router.post('/visit', recordSiteView);

module.exports = router;
