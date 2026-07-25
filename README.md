# 🩺 Medi-Q — Smart Healthcare & Queue-Free Appointment System

**Medi-Q** is a modern MERN stack college mini project featuring **Gemini AI Symptom Triage**, instant doctor appointment booking, and queue management.

---

## 🚀 Key Features

* **🤖 Gemini AI Symptom Triage**:
  - Analyzes patient symptoms and recommends the target department (*Gynecology*, *Pediatrics*, *ENT*, *Cardiology*, *Pulmonology*, *Neurology*, *Dermatology*, *Orthopedics*, *Gastroenterology*, *Urology*, *Psychiatry*).
  - Displays **AI Confidence Score** and **Possible Diseases**.
* **📅 Queue-Free Appointment Booking**:
  - Auto-selects department based on AI triage.
  - Allows manual doctor selection, date picking, and time slot reservation.
* **📋 Patient Appointments Portal**:
  - Displays active tokens, status badges (`Scheduled`, `Completed`, `Cancelled`), and cancel/delete functionality.
* **🔑 Authentication System**:
  - User registration & login with password hashing (`bcryptjs`) and **JWT Tokens**.
* **⚡ In-Memory Demo Fallback**:
  - Works 100% out-of-the-box even if local MongoDB is offline.

---

## 🛠️ Technology Stack

* **Frontend**: React, Vite, Tailwind CSS v3, React Router v6, Axios, Lucide Icons.
* **Backend**: Node.js, Express.js, MongoDB / Mongoose, JWT, bcryptjs, Axios.
* **AI Integration**: Google Gemini 1.5 Flash Model (`gemini-1.5-flash`).

---

## 📁 Project Structure

```text
medi-q/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer
│   │   ├── pages/              # Home, Login, Register, Symptoms, BookAppointment, MyAppointments
│   │   ├── services/           # Axios API configuration (api.js)
│   │   ├── App.jsx             # React Router setup
│   │   └── main.jsx            # Entry point
│   └── package.json
│
└── server/                     # Node.js + Express Backend
    ├── config/                 # db.js (MongoDB connection & fallback)
    ├── controllers/            # authController, appointmentController, symptomController
    ├── models/                 # User.js, Appointment.js
    ├── routes/                 # authRoutes, appointmentRoutes, symptomRoutes
    ├── .env                    # Environment variables
    ├── package.json
    └── server.js               # Main Express server
```

---

## 🖥️ How to Run Locally

### 1. Backend Server
```bash
cd server
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`*

### 2. Frontend Application
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 🌐 Live URLs

* **Frontend App**: `http://localhost:3000`
* **Backend REST API**: `http://localhost:5000/api`
