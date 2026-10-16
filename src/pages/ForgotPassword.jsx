import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ loading: false, message: '', type: '' });

    const handleReset = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, message: '', type: '' });

        try {
            // إرسال طلب استعادة للباك إند
            await axios.post('https://edu-platform-backend-alpha.vercel.app//api/auth/forgot-password', { email });
            // نفترض أن الباك إند سيرد بنجاح الاستلام
            setStatus({ loading: false, message: 'تم إرسال تعليمات استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح.', type: 'success' });
        } catch (error) {
            setStatus({ 
                loading: false, 
                message: 'البريد الإلكتروني غير مسجل أو حدث خطأ في الخادم.', 
                type: 'error' 
            });
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '88vh', padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 30px rgba(11, 36, 71, 0.08)', width: '100%', maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔐</div>
                    <h2 style={{ color: '#0B2447', fontSize: '24px', fontWeight: '800' }}>استعادة كلمة المرور</h2>
                    <p style={{ color: '#888', marginTop: '5px', fontSize: '14px' }}>أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة التعيين</p>
                </div>

                {status.message && (
                    <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: status.type === 'error' ? '#ffebee' : '#e8f5e9', color: status.type === 'error' ? '#c62828' : '#2e7d32' }}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني الجامعي" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', background: '#fcfdfe', fontSize: '15px' }} />
                    
                    <button type="submit" disabled={status.loading} style={{ background: '#0B2447', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: status.loading ? 'not-allowed' : 'pointer', transition: '0.3s', opacity: status.loading ? 0.7 : 1 }}>
                        {status.loading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '25px' }}>
                    <Link to="/" style={{ color: '#666', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>← العودة لتسجيل الدخول</Link>
                </div>
            </div>
        </div>
    );
}