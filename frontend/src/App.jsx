import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import AdminDashboard from './components/AdminDashboard'
import ApplicantForm from './components/ApplicantForm'
import JobOpeningPage from './components/JobOpeningPage'
import ProfileDashboard from './components/ProfileDashboard'
import AdminLogin from './components/AdminLogin'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/job-openings" element={<JobOpeningPage />} />
        <Route path="/profile" element={<ProfileDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />

      </Routes>
    </Router>
  )
}

export default App
