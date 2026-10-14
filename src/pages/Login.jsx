import React, { useState, useContext } from 'react';
// السطر التالي تم تصحيحه ليجمع بين useNavigate و Link في استدعاء واحد فقط
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(''); 
    const [isLoading, setIsLoading] = useState(false); 
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg(''); 
        setIsLoading(true); 

        const result = await login(email, password);
        
        setIsLoading(false); 

        if (result && result.success) {
            navigate('/dashboard'); 
        } else {
            setErrorMsg(result?.message || 'حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة لاحقاً.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '88vh',
            padding: '20px'
        }}>
            <style>
                {`
                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-15px); }
                        100% { transform: translateY(0px); }
                    }
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 0.7; filter: drop-shadow(0 0 5px #00adb5); }
                        50% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 15px #00adb5); }
                        100% { transform: scale(1); opacity: 0.7; filter: drop-shadow(0 0 5px #00adb5); }
                    }
                    @keyframes dash {
                        to { stroke-dashoffset: -40; }
                    }
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>

            <div style={{
                background: 'white',
                borderRadius: '24px',
                boxShadow: '0 15px 40px rgba(11, 36, 71, 0.08)',
                width: '100%',
                maxWidth: '950px',
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                overflow: 'hidden',
                border: '1px solid rgba(0, 173, 181, 0.1)',
                animation: 'slideUp 0.6s ease-out'
            }}>
                
                {/* القسم الأيمن: الرسمة الهندسية */}
                <div style={{
                    background: 'linear-gradient(135deg, #0B2447 0%, #19376D 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '40px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: '40px', textAlign: 'center', color: 'white', zIndex: 10 }}>
                        <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '5px', letterSpacing: '1px' }}>بوابة العقول الهندسية</h3>
                        <p style={{ color: '#00adb5', fontSize: '14px' }}>تواصل، تعلم، وابتكر</p>
                    </div>

                    <svg viewBox="0 0 400 400" width="100%" height="auto" style={{ maxWidth: '400px', marginTop: '40px' }}>
                        <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(0, 173, 181, 0.1)" strokeWidth="1" />
                        <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(0, 173, 181, 0.2)" strokeWidth="1" strokeDasharray="5,5" style={{ animation: 'dash 10s linear infinite' }} />
                        
                        <g stroke="#00adb5" strokeWidth="2" fill="none" opacity="0.6">
                            <path d="M200,200 L70,90 L40,90" />
                            <path d="M200,200 L330,90 L360,90" />
                            <path d="M200,200 L70,310 L40,310" />
                            <path d="M200,200 L330,310 L360,310" />
                            <path d="M200,200 L200,40" strokeDasharray="6,4" style={{ animation: 'dash 3s linear infinite' }} />
                            <path d="M200,200 L200,360" strokeDasharray="6,4" style={{ animation: 'dash 3s linear infinite' }} />
                        </g>

                        <g fill="white">
                            <circle cx="70" cy="90" r="4" />
                            <circle cx="330" cy="90" r="4" />
                            <circle cx="70" cy="310" r="4" />
                            <circle cx="330" cy="310" r="4" />
                            <circle cx="200" cy="70" r="4" />
                            <circle cx="200" cy="330" r="4" />
                        </g>

                        <g style={{ animation: 'float 4s ease-in-out infinite', transformOrigin: 'center' }}>
                            <rect x="135" y="135" width="130" height="130" rx="16" fill="rgba(255,255,255,0.05)" stroke="#00adb5" strokeWidth="2" backdropFilter="blur(5px)" />
                            <rect x="145" y="145" width="110" height="110" rx="12" fill="#0B2447" stroke="rgba(0, 173, 181, 0.5)" strokeWidth="1" />
                            
                            <g stroke="#00adb5" strokeWidth="3" strokeLinecap="round">
                                <path d="M125,160 L135,160 M125,180 L135,180 M125,200 L135,200 M125,220 L135,220 M125,240 L135,240" />
                                <path d="M265,160 L275,160 M265,180 L275,180 M265,200 L275,200 M265,220 L275,220 M265,240 L275,240" />
                                <path d="M160,125 L160,135 M180,125 L180,135 M200,125 L200,135 M220,125 L220,135 M240,125 L240,135" />
                                <path d="M160,265 L160,275 M180,265 L180,275 M200,265 L200,275 M220,265 L220,275 M240,265 L240,275" />
                            </g>

                            <circle cx="200" cy="200" r="22" fill="#00adb5" style={{ animation: 'pulse 2s infinite', transformOrigin: 'center' }} />
                            <path d="M185,200 L215,200 M200,185 L200,215" stroke="#19376D" strokeWidth="3" strokeLinecap="round" />
                        </g>
                    </svg>

                    <div style={{ position: 'absolute', bottom: '-50px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '100px', background: '#00adb5', filter: 'blur(80px)', opacity: 0.3 }}></div>
                </div>

                {/* القسم الأيسر: نموذج تسجيل الدخول */}
                <div style={{ padding: '50px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#ffffff' }}>
                    <h2 style={{ color: '#0B2447', marginBottom: '8px', fontSize: '28px', fontWeight: '800' }}>تسجيل الدخول</h2>
                    <p style={{ color: '#888', marginBottom: '25px', fontSize: '14px' }}>أدخل بياناتك الجامعية للوصول إلى المحاضرات</p>

                    {errorMsg && (
                        <div style={{ 
                            color: '#d32f2f', 
                            background: '#ffebee', 
                            padding: '12px', 
                            borderRadius: '8px', 
                            marginBottom: '20px', 
                            fontSize: '14px', 
                            fontWeight: 'bold', 
                            textAlign: 'center',
                            border: '1px solid #ffcdd2'
                        }}>
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div style={{ position: 'relative', marginBottom: '20px' }}>
                            <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#00adb5', fontSize: '18px' }}>@</span>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="البريد الإلكتروني الجامعي"
                                style={{
                                    width: '100%', padding: '16px 45px 16px 15px', border: '2px solid rgba(0, 173, 181, 0.3)',
                                    borderRadius: '12px', outline: 'none', fontSize: '15px', background: '#fcfdfe', transition: '0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#00adb5'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(0, 173, 181, 0.3)'}
                                disabled={isLoading} 
                            />
                        </div>

                        <div style={{ position: 'relative', marginBottom: '15px' }}>
                            <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: '18px' }}>🔒</span>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="كلمة المرور"
                                style={{
                                    width: '100%', padding: '16px 45px 16px 15px', border: '2px solid transparent',
                                    borderRadius: '12px', outline: 'none', fontSize: '15px', background: '#f4f7f6', transition: '0.3s'
                                }}
                                onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = '#00adb5'; }}
                                onBlur={(e) => { e.target.style.background = '#f4f7f6'; e.target.style.borderColor = 'transparent'; }}
                                disabled={isLoading} 
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', fontSize: '13px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', cursor: 'pointer', fontWeight: '600' }}>
                                <input type="checkbox" style={{ accentColor: '#00adb5', width: '16px', height: '16px' }} disabled={isLoading} /> تذكرني
                            </label>
                            {/* الرابط الصحيح باستخدام Link بدلاً من a */}
                            <Link to="/forgot-password" style={{ color: '#0B2447', textDecoration: 'none', fontWeight: '700', transition: '0.2s' }}>نسيت كلمة المرور؟</Link>
                        </div>

                        <button type="submit" disabled={isLoading} style={{
                            background: '#0B2447', color: 'white', border: 'none', padding: '16px', borderRadius: '12px',
                            fontSize: '16px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', 
                            boxShadow: '0 8px 20px rgba(11, 36, 71, 0.25)', width: '100%', marginBottom: '20px', 
                            transition: 'transform 0.2s, background 0.3s',
                            opacity: isLoading ? 0.7 : 1
                        }}
                        onMouseOver={(e) => { if(!isLoading) e.target.style.background = '#19376D' }}
                        onMouseOut={(e) => { if(!isLoading) e.target.style.background = '#0B2447' }}
                        >
                            {isLoading ? 'جاري التحقق... ⏳' : 'تسجيل الدخول'}
                        </button>

                        <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
                            ليس لديك حساب؟ <Link to="/register" style={{ color: '#00adb5', textDecoration: 'none', fontWeight: 'bold' }}>إنشاء حساب جديد</Link>
                        </p>
                    </form>
                </div>

            </div>
        </div>
    );
}