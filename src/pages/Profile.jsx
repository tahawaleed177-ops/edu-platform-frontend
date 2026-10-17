import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
    const { user, logout } = useContext(AuthContext);
    const [completedCount, setCompletedCount] = useState(0);

    // جلب عدد المحاضرات المكتملة لعرضها في الإحصائيات
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
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
    }, []);

    if (!user) return <div style={{textAlign: 'center', padding: '50px', color: '#00adb5'}}>جاري التحميل...</div>;

    return (
        <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px', minHeight: '80vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#0B2447', fontSize: '32px', fontWeight: '900', margin: '0 0 10px 0' }}>الملف الشخصي</h2>
            </div>

            <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>
                    {user.isAdmin ? '👨‍🏫' : '👨‍💻'}
                </div>
                
                <h2 style={{ color: '#0B2447', fontSize: '28px', margin: '0 0 10px 0' }}>
                    {user.name || user.full_name || 'طالب هندسة'}
                </h2>
                <p style={{ color: '#666', fontSize: '16px', marginBottom: '40px' }}>{user.email}</p>

                {/* === قسم الإحصائيات === */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
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
    );
}