import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
    // جلب الدوال والبيانات من الـ Context
    const { user, logout, dispatch } = useContext(AuthContext);
    
    // حالة الإحصائيات
    const [completedCount, setCompletedCount] = useState(0);

    // حالات تعديل البيانات وكلمة المرور
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    // حالات واجهة المستخدم
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // تعيين البيانات الأولية للمستخدم عند التحميل
    useEffect(() => {
        if (user) {
            setName(user.name || user.full_name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    // جلب عدد المحاضرات المكتملة لعرضها في الإحصائيات
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = user?.token || localStorage.getItem('token');
                if (!token) return;
                const res = await axios.get('https://edu-platform-backend-alpha.vercel.app/api/progress', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setCompletedCount(res.data.completed.length);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, [user]);

    // دالة تحديث الاسم
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const token = user?.token || localStorage.getItem('token');
            const res = await axios.put('https://edu-platform-backend-alpha.vercel.app/api/users/profile', 
                { name }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setMessage({ text: 'تم تحديث الاسم بنجاح!', type: 'success' });
                // تحديث الـ LocalStorage
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                storedUser.name = name;
                localStorage.setItem('user', JSON.stringify(storedUser));
                localStorage.setItem('userName', name);
                
                // إذا كان لديك dispatch في AuthContext لتحديث الحالة
                if (dispatch) {
                    dispatch({ type: 'UPDATE_USER', payload: { ...user, name } });
                }
            }
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'حدث خطأ أثناء تحديث البيانات.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    // دالة تغيير كلمة المرور
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        if (newPassword.length < 6) {
            setMessage({ text: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.', type: 'error' });
            setIsLoading(false);
            return;
        }

        try {
            const token = user?.token || localStorage.getItem('token');
            const res = await axios.put('https://edu-platform-backend-alpha.vercel.app/api/users/change-password', 
                { currentPassword, newPassword }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setMessage({ text: 'تم تغيير كلمة المرور بنجاح!', type: 'success' });
                setCurrentPassword('');
                setNewPassword('');
            }
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'كلمة المرور الحالية غير صحيحة.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return <div style={{textAlign: 'center', padding: '50px', color: '#00adb5'}}>جاري التحميل...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', minHeight: '80vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#0B2447', fontSize: '32px', fontWeight: '900', margin: '0 0 10px 0' }}>الملف الشخصي</h2>
            </div>

            <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                
                {/* الهيدر ومعلومات المستخدم */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '80px', marginBottom: '20px' }}>
                        {user.isAdmin ? '👨‍🏫' : '👨‍💻'}
                    </div>
                    <h2 style={{ color: '#0B2447', fontSize: '28px', margin: '0 0 5px 0' }}>
                        {name || 'طالب هندسة'}
                    </h2>
                    <p style={{ color: '#666', fontSize: '16px', margin: '0 0 30px 0' }}>{email}</p>
                </div>

                {/* === قسم الإحصائيات === */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px', flexWrap: 'wrap', textAlign: 'center' }}>
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '20px', borderRadius: '16px', flex: '1', minWidth: '150px' }}>
                        <h3 style={{ margin: 0, color: '#166534', fontSize: '36px' }}>{completedCount}</h3>
                        <p style={{ margin: '5px 0 0 0', color: '#15803d', fontWeight: 'bold' }}>محاضرة مكتملة ✅</p>
                    </div>
                    
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '20px', borderRadius: '16px', flex: '1', minWidth: '150px' }}>
                        <h3 style={{ margin: 0, color: '#1e40af', fontSize: '24px', paddingTop: '10px' }}>
                            {user.isAdmin ? 'مدير منصة' : 'طالب مرحلة 2'}
                        </h3>
                        <p style={{ margin: '10px 0 0 0', color: '#1d4ed8', fontWeight: 'bold' }}>نوع الحساب 🎓</p>
                    </div>
                </div>

                {/* رسائل التنبيه (نجاح أو خطأ) */}
                {message.text && (
                    <div style={{ padding: '15px', borderRadius: '12px', marginBottom: '30px', fontSize: '15px', fontWeight: 'bold', textAlign: 'center', background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', color: message.type === 'success' ? '#166534' : '#991b1b', border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}` }}>
                        {message.type === 'success' ? '✅ ' : '❌ '} {message.text}
                    </div>
                )}

                {/* === قسم التعديلات والإعدادات === */}
                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginBottom: '40px' }}>
                    
                    {/* تعديل الاسم */}
                    <form onSubmit={handleUpdateProfile} style={{ flex: '1 1 300px', background: '#f8fafc', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#0B2447', fontSize: '18px' }}>تعديل البيانات</h3>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>الاسم الكامل</label>
                            <input 
                                type="text" value={name} onChange={(e) => setName(e.target.value)} required 
                                style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' }} 
                            />
                        </div>
                        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '12px', background: '#0B2447', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                            {isLoading ? 'جاري الحفظ...' : 'حفظ الاسم'}
                        </button>
                    </form>

                    {/* تغيير كلمة المرور */}
                    <form onSubmit={handleChangePassword} style={{ flex: '1 1 300px', background: '#f8fafc', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#0B2447', fontSize: '18px' }}>الأمان</h3>
                        <div style={{ marginBottom: '15px' }}>
                            <input 
                                type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required placeholder="كلمة المرور الحالية" 
                                style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' }} 
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <input 
                                type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength="6" placeholder="كلمة المرور الجديدة" 
                                style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' }} 
                            />
                        </div>
                        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '12px', background: 'transparent', color: '#00adb5', border: '2px solid #00adb5', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                            {isLoading ? 'جاري التحديث...' : 'تغيير كلمة المرور'}
                        </button>
                    </form>

                </div>

                {/* زر تسجيل الخروج */}
                <div style={{ textAlign: 'center', borderTop: '2px solid #f1f5f9', paddingTop: '30px' }}>
                    <button
                        onClick={logout}
                        style={{
                            background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca',
                            padding: '15px 30px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold',
                            cursor: 'pointer', transition: '0.2s', width: '100%', maxWidth: '300px'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#fecaca'}
                        onMouseOut={(e) => e.target.style.background = '#fee2e2'}
                    >
                        🚪 تسجيل الخروج
                    </button>
                </div>
                
            </div>
        </div>
    );
}