import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadMaterial from './pages/UploadMaterial';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import { AuthProvider } from './context/AuthContext';
import Announcements from './pages/Announcements'; // (أو مسار المجلد الذي حفظتها فيه)
// استدعاء حارس المسارات
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* الروابط العامة (مفتوحة للجميع) */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/announcements" element={<Announcements />} />
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
    </AuthProvider>
  );
}

export default App;