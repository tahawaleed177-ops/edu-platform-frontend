import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext'; // <-- استيراد سياق الوضع الليلي

export default function Navbar() {
    const { user } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext); // <-- جلب حالة الثيم من السياق

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
                        {/* === زر التبديل بين الوضع الليلي والنهاري === */}
                        <button 
                            onClick={toggleTheme} 
                            style={{ 
                                background: 'rgba(255,255,255,0.1)', border: 'none', 
                                fontSize: '18px', cursor: 'pointer', padding: '6px 10px', 
                                borderRadius: '50%', transition: '0.3s',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            title={isDarkMode ? "الوضع النهاري" : "الوضع الليلي"}
                        >
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>

                        {/* === رابط الملف الشخصي === */}
                        <Link to="/profile" style={{ 
                            display: 'flex', alignItems: 'center', gap: '8px', 
                            background: '#19376D', padding: '6px 15px', borderRadius: '20px', 
                            color: '#00adb5', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold',
                            transition: '0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#112b59'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#19376D'}
                        >
                            👤 {user.name || user.full_name || 'حسابي'}
                        </Link>
                        
                        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>المحاضرات</Link>
                        
                        <Link to="/schedule" style={{ color: 'white', textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>
                            📅 الجدول
                        </Link>

                        <Link to="/favorites" style={{ color: 'white', textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>
                            ⭐ المفضلة
                        </Link>
                        
                        <Link to="/announcements" style={{ 
                            color: 'white', textDecoration: 'none', fontSize: '15px', fontWeight: '600',
                            display: 'flex', alignItems: 'center', gap: '5px'
                        }}>
                            📢 التبليغات
                        </Link>
                        
                        {user.isAdmin && (
                            <Link to="/upload" style={{ 
                                background: '#00adb5', color: 'white', textDecoration: 'none', 
                                padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' 
                            }}>
                                + إضافة محاضرة
                            </Link>
                        )}
                    </>
                )}
            </div>
        </nav>
    );
}