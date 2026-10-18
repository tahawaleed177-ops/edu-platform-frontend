import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadMaterial from './pages/UploadMaterial';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Announcements from './pages/Announcements';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'; 
import Favorites from './pages/Favorites';
import Schedule from './pages/Schedule';
import Profile from './pages/Profile';
import { ThemeProvider } from './context/ThemeContext';
import GPACalculator from './pages/GPACalculator';
import MireoChat from './components/MireoChat';
import LectureTutor from './pages/LectureTutor';
import Attendance from './pages/Attendance'; 

function App() {
  return (
    <AuthProvider>
      <ThemeProvider> 
        <Router>
          <Navbar />
          <Routes>
            {/* الروابط العامة (مفتوحة للجميع) */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* روابط الطلاب المحمية */}
            <Route path="/schedule" element={ <ProtectedRoute><Schedule /></ProtectedRoute> } />
            <Route path="/favorites" element={ <ProtectedRoute><Favorites /></ProtectedRoute> } />
            <Route path="/profile" element={ <ProtectedRoute><Profile /></ProtectedRoute> } />
            <Route path="/gpa-calculator" element={ <ProtectedRoute><GPACalculator /></ProtectedRoute> } />
            <Route path="/lecture-tutor" element={ <ProtectedRoute><LectureTutor /></ProtectedRoute> } />
            
            {/* رابط التبليغات */}
            <Route 
              path="/announcements" 
              element={
                <ProtectedRoute>
                  <Announcements />
                </ProtectedRoute>
              } 
            />

            {/* رابط لوحة التحكم */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* === الروابط الإدارية (محمية: تتطلب صلاحية أدمن حصراً) === */}
            
            {/* رابط رفع المحاضرات */}
            <Route
              path="/upload"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <UploadMaterial />
                </ProtectedRoute>
              }
            />

            {/* رابط سجل الحضور بالباركود */}
            <Route
              path="/attendance"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Attendance />
                </ProtectedRoute>
              }
            />

            {/* في حال كتابة أي رابط خاطئ في المتصفح يتم توجيهه للصفحة الرئيسية */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* === أيقونة ميريو العائمة === */}
          <MireoChat />

        </Router>
      </ThemeProvider> 
    </AuthProvider>
  );
}

export default App;