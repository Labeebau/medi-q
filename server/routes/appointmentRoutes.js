const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getUserAppointments,
  deleteAppointment,
} = require('../controllers/appointmentController');

// POST /api/appointments
router.post('/', createAppointment);

// GET /api/appointments/:userId
router.get('/:userId', getUserAppointments);

// DELETE /api/appointments/:id
router.delete('/:id', deleteAppointment);

module.exports = router;
