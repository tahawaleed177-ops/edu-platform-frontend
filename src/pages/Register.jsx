import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({ loading: false, message: '', type: '' });
    
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, message: '', type: '' });

        try {
            // إرسال بيانات المستخدم الجديد للباك إند
            const response = await axios.post('https://edu-platform-backend-alpha.vercel.app//api/auth/register', {
                name,
                email,
                password
            });

            if (response.data.success || response.status === 201) {
                setStatus({ loading: false, message: 'تم إنشاء الحساب بنجاح! سيتم تحويلك لتسجيل الدخول...', type: 'success' });
                // تحويل المستخدم لصفحة الدخول بعد ثانيتين
                setTimeout(() => navigate('/'), 2000); 
            }
        } catch (error) {
            setStatus({ 
                loading: false, 
                message: error.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً.', 
                type: 'error' 
            });
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '88vh', padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 30px rgba(11, 36, 71, 0.08)', width: '100%', maxWidth: '500px', borderTop: '5px solid #00adb5' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ color: '#0B2447', fontSize: '26px', fontWeight: '800' }}>إنشاء حساب جديد</h2>
                    <p style={{ color: '#888', marginTop: '5px' }}>انضم إلى منصة قسم هندسة الحاسوب</p>
                </div>

                {status.message && (
                    <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold', background: status.type === 'error' ? '#ffebee' : '#e8f5e9', color: status.type === 'error' ? '#c62828' : '#2e7d32' }}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', background: '#fcfdfe', fontSize: '15px' }} />
                    </div>
                    <div>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني الجامعي" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', background: '#fcfdfe', fontSize: '15px' }} />
                    </div>
                    <div>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', background: '#fcfdfe', fontSize: '15px' }} />
                    </div>
                    <button type="submit" disabled={status.loading} style={{ background: '#00adb5', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: status.loading ? 'not-allowed' : 'pointer', boxShadow: '0 8px 20px rgba(0, 173, 181, 0.2)', transition: '0.3s', opacity: status.loading ? 0.7 : 1 }}>
                        {status.loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginTop: '25px' }}>
                    لديك حساب بالفعل؟ <Link to="/" style={{ color: '#0B2447', textDecoration: 'none', fontWeight: 'bold' }}>تسجيل الدخول</Link>
                </p>
            </div>
        </div>
    );
}