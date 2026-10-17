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
import './App.css'; // تأكد من وجود هذا السطر
import Favorites from './pages/Favorites';
import Schedule from './pages/Schedule';
import Profile from './pages/Profile';
import { ThemeProvider } from './context/ThemeContext';
import GPACalculator from './pages/GPACalculator';
function App() {
  return (
    <AuthProvider>
      <ThemeProvider> {/* <--- تمت الإضافة هنا لتغليف التطبيق */}
        <Router>
          <Navbar />
          <Routes>
            {/* الروابط العامة (مفتوحة للجميع) */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/schedule" element={ <ProtectedRoute><Schedule /></ProtectedRoute> } />
            <Route path="/favorites" element={ <ProtectedRoute><Favorites /></ProtectedRoute> } />
            <Route path="/profile" element={ <ProtectedRoute><Profile /></ProtectedRoute> } />
            <Route path="/gpa-calculator" element={ <ProtectedRoute><GPACalculator /></ProtectedRoute> } />
            {/* رابط التبليغات (محمي: للطلاب والأدمن فقط) */}
            <Route 
              path="/announcements" 
              element={
                <ProtectedRoute>
                  <Announcements />
                </ProtectedRoute>
              } 
            />

            {/* رابط لوحة التحكم (محمي: يتطلب تسجيل الدخول لأي طالب أو أدمن) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* رابط رفع المحاضرات (محمي: يتطلب تسجيل الدخول + صلاحية أدمن حصراً) */}
            <Route
              path="/upload"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <UploadMaterial />
                </ProtectedRoute>
              }
            />

            {/* في حال كتابة أي رابط خاطئ في المتصفح يتم توجيهه للصفحة الرئيسية */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider> {/* <--- الإغلاق هنا */}
    </AuthProvider>
  );
}

export default App;