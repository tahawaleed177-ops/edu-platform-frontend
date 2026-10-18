import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import QRCode from 'react-qr-code'; 

export default function Profile() {
    const { user, logout, dispatch } = useContext(AuthContext);
    
    // 1. حالة الإحصائيات
    const [completedCount, setCompletedCount] = useState(0);

    // 2. حالات تعديل البيانات الأكاديمية وكلمة المرور
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [studyType, setStudyType] = useState(''); 
    const [section, setSection] = useState('');     
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    // 3. حالات لوحة إدارة المشرفين
    const [targetEmail, setTargetEmail] = useState('');
    const [adminMessage, setAdminMessage] = useState({ text: '', type: '' });
    const [isAdminLoading, setIsAdminLoading] = useState(false);
    
    // 4. حالة إظهار/إخفاء الباركود
    const [showQR, setShowQR] = useState(false);

    // حالات واجهة المستخدم العامة
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // تعيين البيانات الأولية للمستخدم عند التحميل
    useEffect(() => {
        if (user) {
            setName(user.name || user.full_name || '');
            setEmail(user.email || '');
            setStudyType(user.studyType || ''); 
            setSection(user.section || '');     
        }
    }, [user]);

    // جلب عدد المحاضرات المكتملة
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

    // دالة تحديث البيانات
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const token = user?.token || localStorage.getItem('token');
            const res = await axios.put('https://edu-platform-backend-alpha.vercel.app/api/users/profile', 
                { name, study_type: studyType, section }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setMessage({ text: 'تم تحديث البيانات بنجاح!', type: 'success' });
                
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                storedUser.name = name;
                storedUser.studyType = studyType;
                storedUser.section = section;
                localStorage.setItem('user', JSON.stringify(storedUser));
                localStorage.setItem('userName', name);
                
                if (dispatch) {
                    dispatch({ type: 'UPDATE_USER', payload: { ...user, name, studyType, section } });
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

    // دالة إدارة المشرفين
    const handleAdminToggle = async (makeAdmin) => {
        if (!targetEmail.trim()) return;
        setIsAdminLoading(true);
        setAdminMessage({ text: '', type: '' });

        try {
            const token = user?.token || localStorage.getItem('token');
            const res = await axios.put('https://edu-platform-backend-alpha.vercel.app/api/users/admin-role', 
                { email: targetEmail, makeAdmin }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setAdminMessage({ text: res.data.message, type: 'success' });
                setTargetEmail(''); 
            }
        } catch (error) {
            setAdminMessage({ text: error.response?.data?.message || 'حدث خطأ أثناء تعديل الصلاحيات.', type: 'error' });
        } finally {
            setIsAdminLoading(false);
        }
    };

    if (!user) return <div style={{textAlign: 'center', padding: '50px', color: '#00adb5'}}>جاري التحميل...</div>;

    // القيمة المشفرة داخل الباركود (تعتمد على الإيميل أو الـ ID لضمان عملها دائماً)
    const qrValue = (email || user?.email || user?.id?.toString() || 'student').trim().toLowerCase();

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', minHeight: '80vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#0B2447', fontSize: '32px', fontWeight: '900', margin: '0 0 10px 0' }}>الملف الشخصي</h2>
            </div>

            <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                
                {/* معلومات المستخدم الأساسية */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '80px', marginBottom: '20px' }}>
                        {user.isAdmin ? '👨‍🏫' : '👨‍💻'}
                    </div>
                    <h2 style={{ color: '#0B2447', fontSize: '28px', margin: '0 0 5px 0' }}>
                        {name || 'طالب هندسة'}
                    </h2>
                    <p style={{ color: '#666', fontSize: '16px', margin: '0 0 30px 0' }}>{email}</p>
                </div>

                {/* قسم الإحصائيات والمعلومات */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', flexWrap: 'wrap', textAlign: 'center' }}>
                    
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '20px', borderRadius: '16px', flex: '1 1 150px' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#166534', fontSize: '30px' }}>{completedCount}</h3>
                        <p style={{ margin: 0, color: '#15803d', fontWeight: 'bold' }}>محاضرة مكتملة ✅</p>
                    </div>
                    
                    <div style={{ background: '#fef3c7', border: '1px solid #fde68a', padding: '20px', borderRadius: '16px', flex: '1 1 150px' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#b45309', fontSize: '20px', paddingTop: '10px' }}>
                            {studyType || 'غير محدد'} - {section || '?'}
                        </h3>
                        <p style={{ margin: 0, color: '#d97706', fontWeight: 'bold' }}>التصنيف 🎓</p>
                    </div>

                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '20px', borderRadius: '16px', flex: '1 1 150px' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#1e40af', fontSize: '20px', paddingTop: '10px' }}>
                            {user.isAdmin ? 'مدير منصة' : 'طالب'}
                        </h3>
                        <p style={{ margin: 0, color: '#1d4ed8', fontWeight: 'bold' }}>نوع الحساب 🛡️</p>
                    </div>

                </div>

                {/* === هوية الحضور الذكية (تظهر للجميع دائماً بدون أي شروط إخفاء) === */}
                <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: '30px' }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#0B2447', fontSize: '18px' }}>📱 هوية الحضور الذكية</h3>
                    
                    {!showQR ? (
                        <button 
                            type="button"
                            onClick={() => setShowQR(true)}
                            style={{ padding: '12px 25px', background: '#00adb5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '5px' }}
                        >
                            إظهار الباركود الخاص بي 📷
                        </button>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: 'white', padding: '15px', display: 'inline-block', borderRadius: '12px', border: '2px solid #00adb5' }}>
                                <QRCode value={qrValue} size={160} />
                            </div>
                            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>أبرز هذا الباركود للدكتور أو المشرف لتسجيل حضورك في المحاضرة.</p>
                            <button 
                                type="button"
                                onClick={() => setShowQR(false)}
                                style={{ padding: '8px 20px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                            >
                                إخفاء الباركود
                            </button>
                        </div>
                    )}
                </div>

                {/* رسائل التنبيه */}
                {message.text && (
                    <div style={{ padding: '15px', borderRadius: '12px', marginBottom: '30px', fontSize: '15px', fontWeight: 'bold', textAlign: 'center', background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', color: message.type === 'success' ? '#166534' : '#991b1b', border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}` }}>
                        {message.type === 'success' ? '✅ ' : '❌ '} {message.text}
                    </div>
                )}

                {/* قسم التعديلات والإعدادات */}
                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    
                    {/* تعديل البيانات الأكاديمية */}
                    <form onSubmit={handleUpdateProfile} style={{ flex: '1 1 300px', background: '#f8fafc', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#0B2447', fontSize: '18px' }}>البيانات الأكاديمية</h3>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>الاسم الكامل</label>
                            <input 
                                type="text" value={name} onChange={(e) => setName(e.target.value)} required 
                                style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' }} 
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>نوع الدراسة</label>
                            <select value={studyType} onChange={(e) => setStudyType(e.target.value)} style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', backgroundColor: 'white' }}>
                                <option value="" disabled>-- اختر نوع الدراسة --</option>
                                <option value="صباحي">دراسة صباحية</option>
                                <option value="استضافة">استضافة</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>الشعبة (الكروب)</label>
                            <select value={section} onChange={(e) => setSection(e.target.value)} style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', backgroundColor: 'white' }}>
                                <option value="" disabled>-- اختر الشعبة --</option>
                                <option value="GA">GA</option>
                                <option value="GB">GB</option>
                            </select>
                        </div>

                        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '12px', background: '#0B2447', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                            {isLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
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

                {/* === لوحة إدارة المشرفين (تظهر للمديرين فقط) === */}
                {user?.isAdmin && (
                    <div style={{ background: '#fffbeb', padding: '25px', borderRadius: '16px', border: '1px solid #fde68a', margin: '30px 0' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#b45309', fontSize: '18px', fontWeight: 'bold' }}>👑 لوحة الإدارة: صلاحيات المشرفين</h3>
                        
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 250px' }}>
                                <input 
                                    type="email" 
                                    value={targetEmail} 
                                    onChange={(e) => setTargetEmail(e.target.value)} 
                                    placeholder="أدخل البريد الإلكتروني للمستخدم..." 
                                    style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #fcd34d', fontSize: '15px', outline: 'none' }} 
                                />
                            </div>
                            
                            <div style={{ display: 'flex', gap: '10px', flex: '1 1 auto' }}>
                                <button 
                                    onClick={() => handleAdminToggle(true)} 
                                    disabled={isAdminLoading || !targetEmail} 
                                    style={{ flex: 1, padding: '12px', background: '#059669', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: isAdminLoading || !targetEmail ? 'not-allowed' : 'pointer' }}
                                >
                                    ترقية لمدير
                                </button>
                                <button 
                                    onClick={() => handleAdminToggle(false)} 
                                    disabled={isAdminLoading || !targetEmail} 
                                    style={{ flex: 1, padding: '12px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: isAdminLoading || !targetEmail ? 'not-allowed' : 'pointer' }}
                                >
                                    إلغاء الإشراف
                                </button>
                            </div>
                        </div>

                        {adminMessage.text && (
                            <div style={{ marginTop: '15px', padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', color: adminMessage.type === 'success' ? '#065f46' : '#991b1b', background: adminMessage.type === 'success' ? '#d1fae5' : '#fee2e2', border: `1px solid ${adminMessage.type === 'success' ? '#a7f3d0' : '#fecaca'}` }}>
                                {adminMessage.text}
                            </div>
                        )}
                    </div>
                )}

                {/* زر تسجيل الخروج */}
                <div style={{ textAlign: 'center', borderTop: '2px solid #f1f5f9', paddingTop: '30px' }}>
                    <button
                        onClick={logout}
                        style={{
                            background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca',
                            padding: '15px 30px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold',
                            cursor: 'pointer', transition: '0.2s', width: '100%', maxWidth: '300px'
                        }}
                    >
                        🚪 تسجيل الخروج
                    </button>
                </div>
                
            </div>
        </div>
    );
}