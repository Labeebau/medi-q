const Appointment = require('../models/Appointment');

// In-Memory Appointments Store for demo fallback
const memoryAppointments = [
  {
    _id: 'apt_1001',
    userId: '660000000000000000000000',
    doctor: 'Dr. Sarah Jenkins (Senior Physician)',
    department: 'General Medicine',
    date: '2026-07-28',
    time: '10:30 AM',
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'apt_1002',
    userId: '660000000000000000000000',
    doctor: 'Dr. Emily Vance (Cardiologist)',
    department: 'Cardiology',
    date: '2026-08-02',
    time: '02:00 PM',
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
];

// @desc    Create new appointment
// @route   POST /api/appointments
const createAppointment = async (req, res) => {
  try {
    const { userId, doctor, department, date, time, status } = req.body;

    if (!userId || !doctor || !department || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: userId, doctor, department, date, time',
      });
    }

    // 1. If MongoDB is Connected
    if (global.isMongoConnected) {
      const appointment = await Appointment.create({
        userId,
        doctor,
        department,
        date,
        time,
        status: status || 'Scheduled',
      });

      return res.status(201).json({
        success: true,
        message: 'Appointment booked successfully',
        data: appointment,
      });
    }

    // 2. Fallback In-Memory Storage
    const newAppointment = {
      _id: `apt_${Date.now()}`,
      userId,
      doctor,
      department,
      date,
      time,
      status: status || 'Scheduled',
      createdAt: new Date().toISOString(),
    };
    memoryAppointments.push(newAppointment);

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully (In-Memory)',
      data: newAppointment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get appointments for a specific user
// @route   GET /api/appointments/:userId
const getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. If MongoDB is Connected
    if (global.isMongoConnected) {
      const appointments = await Appointment.find({ userId }).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments,
      });
    }

    // 2. Fallback In-Memory Storage
    const userApps = memoryAppointments.filter((a) => a.userId === userId || userId === '660000000000000000000000');
    return res.status(200).json({
      success: true,
      count: userApps.length,
      data: userApps,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete / Cancel appointment by ID
// @route   DELETE /api/appointments/:id
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. If MongoDB is Connected
    if (global.isMongoConnected) {
      const appointment = await Appointment.findById(id);
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }
      await Appointment.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: `Appointment ${id} deleted successfully`,
      });
    }

    // 2. Fallback In-Memory Storage
    const idx = memoryAppointments.findIndex((a) => a._id === id);
    if (idx !== -1) {
      memoryAppointments.splice(idx, 1);
    }
    return res.status(200).json({
      success: true,
      message: `Appointment ${id} deleted successfully (In-Memory)`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAppointment,
  getUserAppointments,
  deleteAppointment,
};
