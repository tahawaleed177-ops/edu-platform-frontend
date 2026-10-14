import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return null;
    }

    // التحقق من وجود مستخدم مسجل في Context أو في LocalStorage
    const storedUser = localStorage.getItem('user');
    const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);

    // 1. إذا لم يكن مسجلاً للدخول، يتم تحويله لصفحة تسجيل الدخول
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // 2. إذا كانت الصفحة مخصصة للإدارة فقط والمستخدم طالب عادي، يتم تحويله للوحة التحكم
    if (adminOnly && !currentUser.isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    // 3. السماح بالدخول
    return children;
}