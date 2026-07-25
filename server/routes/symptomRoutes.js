const express = require('express');
const router = express.Router();
const { analyzeSymptoms } = require('../controllers/symptomController');

// POST /api/symptoms/analyze
router.post('/analyze', analyzeSymptoms);

module.exports = router;
