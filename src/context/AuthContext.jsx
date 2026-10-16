import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const allowedAdminEmails = ['tahawaleed177@gmail.com'];

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('https://edu-platform-backend-alpha.vercel.app//api/auth/login', {
                email,
                password
            });

            if (response.data.token) {
                const isAdmin = allowedAdminEmails.includes(email.toLowerCase());
                
                // === التعديل هنا: سحب الاسم القادم من الباك إند ===
                // إذا لم يجد اسماً، سيضع "طه" للإدارة، أو "طالب" للمستخدم العادي
                const fullName = response.data.user?.name || (isAdmin ? 'في' : 'طالب');

                const userData = { 
                    email: email, 
                    isAdmin: isAdmin,
                    token: response.data.token,
                    name: fullName // حفظ الاسم في حالة المستخدم
                };

                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData)); 
                
                // === التعديل الأهم: حفظ التوكن والاسم بشكل صريح لتقرأه لوحة التحكم ===
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userName', fullName);
                
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                
                return { success: true };
            }
        } catch (error) {
            console.error("خطأ في تسجيل الدخول:", error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'بيانات الدخول غير صحيحة، تأكد من الإيميل وكلمة المرور' 
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user'); 
        // === تنظيف الذاكرة بالكامل عند الخروج ===
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}