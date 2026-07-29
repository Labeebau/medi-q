import axios from 'axios';

// Configure Axios Instance with Base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Exported API Methods

// 1. User Login
export const login = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

// 2. User Registration
export const register = async (name, email, phone, password) => {
  const response = await API.post('/auth/register', { name, email, phone, password });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

// 3. Book Appointment
export const bookAppointment = async (appointmentData) => {
  const response = await API.post('/appointments', appointmentData);
  return response.data;
};

// 4. Get User Appointments
export const getAppointments = async (userId) => {
  const response = await API.get(`/appointments/${userId}`);
  return response.data;
};

// 5. Analyze Symptoms via Gemini AI
export const analyzeSymptoms = async (symptomsText) => {
  const response = await API.post('/symptoms/analyze', { symptoms: symptomsText });
  return response.data;
};

export default API;
