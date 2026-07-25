const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to MongoDB Database
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/symptoms', require('./routes/symptomRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Medi-Q] Server running on port ${PORT}`);
});
