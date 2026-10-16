import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // العودة لصفحة تسجيل الدخول
    };

    return (
        <nav style={{ 
            background: '#0B2447', padding: '15px 40px', display: 'flex', 
            justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', color: 'white'
        }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>منصة هندسة الحاسوب</h2>
            <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                
                {!user ? (
                    <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>تسجيل الدخول</Link>
                ) : (
                    <>
                        <span style={{ color: '#00adb5', fontSize: '14px' }}>
                            مرحباً: {user.name || user.full_name || user.email}
                        </span>
                        
                        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>المحاضرات</Link>
                        
                        <Link to="/announcements" style={{ 
                            color: 'white', textDecoration: 'none', fontSize: '15px', fontWeight: '600',
                            display: 'flex', alignItems: 'center', gap: '5px'
                        }}>
                            📢 التبليغات
                        </Link>
                        
                        {/* الاعتماد هنا فقط على الصلاحية من قاعدة البيانات */}
                        {user.isAdmin && (
                            <Link to="/upload" style={{ 
                                background: '#00adb5', color: 'white', textDecoration: 'none', 
                                padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' 
                            }}>
                                + إضافة محاضرة
                            </Link>
                        )}

                        <button onClick={handleLogout} style={{
                            background: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d',
                            padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                        }}>خروج</button>
                    </>
                )}
            </div>
        </nav>
    );
}