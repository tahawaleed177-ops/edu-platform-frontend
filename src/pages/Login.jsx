import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');

.lg-root {
    --navy-950: #040d1f;
    --navy-900: #071a3a;
    --navy-800: #0B2447;
    --navy-700: #19376D;
    --cyan: #00e5ff;
    --cyan-600: #00adb5;
    --ink: #0B2447;
    --muted: #6b7a90;
    --line: #e3e9f2;
    font-family: 'Cairo', system-ui, sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 20px;
    position: relative;
    overflow: hidden;
    background:
        radial-gradient(900px 500px at 85% -10%, rgba(0, 229, 255, 0.16), transparent 60%),
        radial-gradient(800px 600px at -10% 110%, rgba(25, 55, 109, 0.9), transparent 60%),
        linear-gradient(160deg, var(--navy-950), var(--navy-900));
    box-sizing: border-box;
}
.lg-root *, .lg-root *::before, .lg-root *::after { box-sizing: border-box; }

/* شبكة الخلفية */
.lg-root::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
        linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
    -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
    pointer-events: none;
}

/* ===== البطاقة ===== */
.lg-card {
    position: relative; z-index: 2;
    width: 100%; max-width: 1060px;
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    border-radius: 28px;
    overflow: hidden;
    background: #fff;
    box-shadow:
        0 0 0 1px rgba(0, 229, 255, 0.18),
        0 40px 100px -20px rgba(0, 0, 0, 0.7),
        0 0 80px -20px rgba(0, 229, 255, 0.25);
    animation: lgRise 0.8s cubic-bezier(.2,.8,.2,1) both;
}
@keyframes lgRise {
    from { opacity: 0; transform: translateY(30px) scale(.98); }
    to { opacity: 1; transform: none; }
}

/* ===== القسم الهندسي ===== */
.lg-brand {
    position: relative;
    padding: 36px 36px 32px;
    color: #fff;
    display: flex; flex-direction: column; justify-content: space-between;
    min-height: 640px;
    background:
        radial-gradient(500px 300px at 70% 20%, rgba(0, 229, 255, 0.18), transparent 65%),
        linear-gradient(145deg, #051430 0%, #0B2447 55%, #19376D 100%);
    overflow: hidden;
}
.lg-brand-top { display: flex; align-items: center; gap: 14px; position: relative; z-index: 3; }
.lg-logo {
    width: 52px; height: 52px; border-radius: 14px;
    display: grid; place-items: center;
    background: linear-gradient(135deg, rgba(0,229,255,.25), rgba(0,229,255,.05));
    border: 1px solid rgba(0, 229, 255, 0.5);
    box-shadow: 0 0 24px rgba(0, 229, 255, 0.35), inset 0 0 12px rgba(0,229,255,.2);
}
.lg-brand-title { font-size: 19px; font-weight: 800; line-height: 1.2; }
.lg-brand-sub { font-size: 12px; color: var(--cyan); letter-spacing: .5px; margin-top: 2px; font-family: 'JetBrains Mono', monospace; direction: ltr; text-align: right; }

.lg-circuit {
    position: absolute; inset: 0; width: 100%; height: 100%;
    z-index: 1; opacity: .9; pointer-events: none;
}
.lg-trace { stroke-dasharray: 6 8; animation: lgDash 6s linear infinite; }
@keyframes lgDash { to { stroke-dashoffset: -140; } }

.lg-chip-wrap {
    position: relative; z-index: 2;
    display: flex; justify-content: center; align-items: center;
    margin: 10px 0;
    animation: lgFloat 5s ease-in-out infinite;
}
@keyframes lgFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.lg-chip {
    width: 150px; height: 150px; border-radius: 28px; position: relative;
    display: grid; place-items: center;
    background: linear-gradient(145deg, #0d2c5c, #071a3a);
    border: 1.5px solid rgba(0, 229, 255, 0.7);
    box-shadow:
        0 0 0 8px rgba(0, 229, 255, 0.06),
        0 0 60px rgba(0, 229, 255, 0.45),
        inset 0 0 40px rgba(0, 229, 255, 0.15);
}
.lg-chip::before, .lg-chip::after {
    content: ''; position: absolute; background:
        repeating-linear-gradient(90deg, var(--cyan) 0 3px, transparent 3px 18px);
    height: 10px; left: 18px; right: 18px; opacity: .8;
}
.lg-chip::before { top: -11px; }
.lg-chip::after { bottom: -11px; }
.lg-chip-pins-v {
    position: absolute; top: 18px; bottom: 18px; width: 10px; opacity: .8;
    background: repeating-linear-gradient(180deg, var(--cyan) 0 3px, transparent 3px 18px);
}
.lg-chip-pins-v.l { left: -11px; } .lg-chip-pins-v.r { right: -11px; }
.lg-chip-core {
    width: 74px; height: 74px; border-radius: 18px; display: grid; place-items: center;
    background: linear-gradient(135deg, var(--cyan), var(--cyan-600));
    color: #04162e; font-family: 'JetBrains Mono', monospace; font-weight: 500; font-size: 24px;
    animation: lgPulse 2.4s ease-in-out infinite;
}
@keyframes lgPulse {
    0%,100% { box-shadow: 0 0 20px rgba(0,229,255,.5); }
    50% { box-shadow: 0 0 46px rgba(0,229,255,.95); }
}

/* نافذة الكود */
.lg-term {
    position: relative; z-index: 3;
    border-radius: 14px; overflow: hidden;
    background: rgba(4, 13, 31, 0.72);
    border: 1px solid rgba(0, 229, 255, 0.25);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    direction: ltr; text-align: left;
}
.lg-term-bar { display: flex; align-items: center; gap: 6px; padding: 9px 14px; background: rgba(255,255,255,.04); border-bottom: 1px solid rgba(255,255,255,.06); }
.lg-dot { width: 9px; height: 9px; border-radius: 50%; }
.lg-term-name { margin-left: 10px; font-size: 11px; color: #7f93b2; font-family: 'JetBrains Mono', monospace; }
.lg-term pre { margin: 0; padding: 14px 16px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.85; color: #cfe3ff; }
.lg-line { display: block; overflow: hidden; white-space: nowrap; width: 0; animation: lgType 1.1s steps(34, end) forwards; }
.lg-line:nth-child(1) { animation-delay: .6s; }
.lg-line:nth-child(2) { animation-delay: 1.8s; }
.lg-line:nth-child(3) { animation-delay: 3.0s; }
.lg-line:nth-child(4) { animation-delay: 4.2s; }
@keyframes lgType { to { width: 100%; } }
.lg-k { color: #ff7ab2; } .lg-s { color: #7ee787; } .lg-f { color: #79c0ff; } .lg-c { color: #6e7f9a; }
.lg-caret { display: inline-block; width: 7px; height: 14px; background: var(--cyan); vertical-align: -2px; animation: lgBlink 1s steps(1) infinite; margin-left: 3px; }
@keyframes lgBlink { 50% { opacity: 0; } }

.lg-feats { position: relative; z-index: 3; display: flex; gap: 8px; flex-wrap: wrap; margin-top: 18px; }
.lg-feat {
    font-size: 12px; font-weight: 600; padding: 7px 12px; border-radius: 999px;
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); color: #d6e4ff;
    display: inline-flex; align-items: center; gap: 6px;
}
.lg-feat i { width: 6px; height: 6px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 8px var(--cyan); }

/* ===== النموذج ===== */
.lg-form-side { padding: 56px 48px; display: flex; flex-direction: column; justify-content: center; background: #fff; position: relative; }
.lg-badge {
    align-self: flex-start;
    font-size: 12px; font-weight: 700; color: var(--cyan-600);
    background: rgba(0, 173, 181, 0.09); border: 1px solid rgba(0, 173, 181, 0.25);
    padding: 6px 12px; border-radius: 999px; margin-bottom: 18px;
    display: inline-flex; align-items: center; gap: 8px;
}
.lg-badge i { width: 7px; height: 7px; border-radius: 50%; background: #1fd18b; box-shadow: 0 0 0 4px rgba(31,209,139,.2); }
.lg-h { font-size: 32px; font-weight: 900; color: var(--ink); margin: 0 0 6px; letter-spacing: -.3px; }
.lg-p { color: var(--muted); font-size: 14.5px; margin: 0 0 28px; line-height: 1.7; }

.lg-err {
    display: flex; gap: 10px; align-items: center;
    background: #fff3f3; border: 1px solid #ffd2d2; color: #c62828;
    padding: 12px 14px; border-radius: 12px; margin-bottom: 20px;
    font-size: 13.5px; font-weight: 700;
    animation: lgShake .45s ease;
}
@keyframes lgShake { 20%,60% { transform: translateX(-6px); } 40%,80% { transform: translateX(6px); } }

.lg-field { position: relative; margin-bottom: 18px; }
.lg-field input.lg-in {
    width: 100%; height: 58px; padding: 22px 48px 6px 48px;
    border: 1.5px solid var(--line); border-radius: 14px; outline: none;
    background: #f8fafd; color: var(--ink); font-size: 15px; font-family: inherit;
    direction: ltr; text-align: right;
    transition: border-color .25s, box-shadow .25s, background .25s;
}
.lg-field input.lg-in:hover { border-color: #c9d6e8; }
.lg-field input.lg-in:focus {
    border-color: var(--cyan-600); background: #fff;
    box-shadow: 0 0 0 4px rgba(0, 173, 181, 0.14);
}
.lg-field label.lg-lb {
    position: absolute; right: 48px; top: 50%; transform: translateY(-50%);
    color: #8a98ad; font-size: 14.5px; pointer-events: none;
    transition: all .2s ease; transform-origin: right center;
}
.lg-field input.lg-in:focus ~ label.lg-lb,
.lg-field input.lg-in:not(:placeholder-shown) ~ label.lg-lb {
    top: 14px; transform: translateY(0) scale(.82); color: var(--cyan-600); font-weight: 700;
}
.lg-ico { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: #9aa8bd; transition: color .25s; display: grid; }
.lg-field input.lg-in:focus ~ .lg-ico { color: var(--cyan-600); }
.lg-eye {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    width: 34px; height: 34px; display: grid; place-items: center;
    background: transparent; border: 0; border-radius: 10px; cursor: pointer; color: #8a98ad;
    transition: background .2s, color .2s;
}
.lg-eye:hover { background: rgba(0,173,181,.1); color: var(--cyan-600); }

.lg-row { display: flex; justify-content: space-between; align-items: center; margin: 6px 0 26px; font-size: 13.5px; }
.lg-check { display: inline-flex; align-items: center; gap: 9px; cursor: pointer; color: #55657d; font-weight: 600; user-select: none; }
.lg-check input { position: absolute; opacity: 0; pointer-events: none; }
.lg-box {
    width: 20px; height: 20px; border-radius: 6px; border: 1.5px solid #c3cfe0; background: #fff;
    display: grid; place-items: center; transition: all .2s;
}
.lg-box svg { opacity: 0; transform: scale(.5); transition: all .2s; }
.lg-check input:checked + .lg-box { background: var(--cyan-600); border-color: var(--cyan-600); }
.lg-check input:checked + .lg-box svg { opacity: 1; transform: scale(1); }
.lg-check input:focus-visible + .lg-box { box-shadow: 0 0 0 4px rgba(0,173,181,.2); }

.lg-link { color: var(--navy-800); font-weight: 700; text-decoration: none; position: relative; }
.lg-link::after { content: ''; position: absolute; right: 0; bottom: -3px; width: 0; height: 2px; background: var(--cyan-600); transition: width .25s; }
.lg-link:hover::after { width: 100%; }

.lg-btn {
    position: relative; overflow: hidden;
    width: 100%; height: 56px; border: 0; border-radius: 14px; cursor: pointer;
    color: #fff; font-family: inherit; font-size: 16px; font-weight: 800; letter-spacing: .2px;
    background: linear-gradient(135deg, #0B2447 0%, #19376D 60%, #0e7f93 130%);
    box-shadow: 0 14px 30px -8px rgba(11, 36, 71, 0.55);
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: transform .2s, box-shadow .25s, filter .2s;
}
.lg-btn::before {
    content: ''; position: absolute; top: 0; bottom: 0; width: 60px; left: -80px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent);
    transform: skewX(-20deg); transition: left .6s ease;
}
.lg-btn:hover:not(:disabled)::before { left: calc(100% + 40px); }
.lg-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 20px 36px -10px rgba(11, 36, 71, 0.65), 0 0 0 4px rgba(0,173,181,.14); }
.lg-btn:active:not(:disabled) { transform: translateY(0); }
.lg-btn:disabled { cursor: not-allowed; filter: saturate(.7); opacity: .85; }
.lg-btn:focus-visible { outline: none; box-shadow: 0 0 0 4px rgba(0,173,181,.35); }
.lg-spin { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 50%; animation: lgSpin .7s linear infinite; }
@keyframes lgSpin { to { transform: rotate(360deg); } }

.lg-or { display: flex; align-items: center; gap: 12px; color: #a3afc2; font-size: 12.5px; margin: 24px 0 18px; }
.lg-or::before, .lg-or::after { content: ''; flex: 1; height: 1px; background: var(--line); }
.lg-reg { text-align: center; color: #5d6d85; font-size: 14.5px; margin: 0; }
.lg-reg a { color: var(--cyan-600); font-weight: 800; text-decoration: none; }
.lg-reg a:hover { text-decoration: underline; }

.lg-secure { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 26px; color: #9aa7bb; font-size: 12px; }

@media (max-width: 880px) {
    .lg-card { grid-template-columns: 1fr; max-width: 520px; }
    .lg-brand { display: none; }
    .lg-form-side { padding: 40px 26px; }
}
@media (prefers-reduced-motion: reduce) {
    .lg-root *, .lg-root *::before, .lg-root *::after { animation-duration: .001s !important; animation-iteration-count: 1 !important; }
}
`;

const IconMail = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7.5 8 6 8-6" />
    </svg>
);
const IconLock = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10.5" width="16" height="10" rx="3" />
        <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
        <circle cx="12" cy="15.5" r="1.2" fill="currentColor" />
    </svg>
);
const IconEye = ({ off }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
        {off && <path d="M4 4l16 16" />}
    </svg>
);
const IconShield = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6L12 3Z" />
        <path d="m9 12 2.2 2.2L15.2 10" />
    </svg>
);

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
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
        <div className="lg-root" dir="rtl">
            <style>{css}</style>

            <div className="lg-card">
                {/* ===== القسم الهندسي ===== */}
                <aside className="lg-brand">
                    {/* لوحة الدوائر المتحركة */}
                    <svg className="lg-circuit" viewBox="0 0 520 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                        <defs>
                            <linearGradient id="lgTrace" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0" stopColor="#00e5ff" stopOpacity="0.9" />
                                <stop offset="1" stopColor="#00adb5" stopOpacity="0.25" />
                            </linearGradient>
                        </defs>
                        <g fill="none" stroke="url(#lgTrace)" strokeWidth="1.4" opacity="0.55">
                            <path id="lgP1" className="lg-trace" d="M0,150 H110 L150,190 H260" />
                            <path id="lgP2" className="lg-trace" d="M520,120 H400 L360,160 H260" />
                            <path id="lgP3" className="lg-trace" d="M0,330 H90 L130,290 H250" />
                            <path id="lgP4" className="lg-trace" d="M520,300 H420 L380,340 H270" />
                            <path className="lg-trace" d="M260,0 V90 L290,120 V190" />
                            <path className="lg-trace" d="M60,420 H200 L230,390 H300" />
                        </g>
                        <g fill="#00e5ff">
                            <circle cx="110" cy="150" r="3" /><circle cx="400" cy="120" r="3" />
                            <circle cx="90" cy="330" r="3" /><circle cx="420" cy="300" r="3" />
                            <circle cx="260" cy="90" r="3" />
                        </g>
                        {/* نبضات بيانات تتحرك على المسارات */}
                        <g fill="#fff">
                            <circle r="3.5"><animateMotion dur="4s" repeatCount="indefinite"><mpath href="#lgP1" /></animateMotion></circle>
                            <circle r="3.5"><animateMotion dur="5s" repeatCount="indefinite" begin="1s"><mpath href="#lgP2" /></animateMotion></circle>
                            <circle r="3.5"><animateMotion dur="4.5s" repeatCount="indefinite" begin="2s"><mpath href="#lgP3" /></animateMotion></circle>
                            <circle r="3.5"><animateMotion dur="5.5s" repeatCount="indefinite" begin=".5s"><mpath href="#lgP4" /></animateMotion></circle>
                        </g>
                    </svg>

                    <div className="lg-brand-top">
                        <div className="lg-logo">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m8 8-4 4 4 4" />
                                <path d="m16 8 4 4-4 4" />
                                <path d="m13.5 6-3 12" />
                            </svg>
                        </div>
                        <div>
                            <div className="lg-brand-title">كلية هندسة الحاسوب</div>
                            <div className="lg-brand-sub">COMPUTER ENGINEERING PORTAL</div>
                        </div>
                    </div>

                    <div className="lg-chip-wrap" aria-hidden="true">
                        <div className="lg-chip">
                            <span className="lg-chip-pins-v l" />
                            <span className="lg-chip-pins-v r" />
                            <div className="lg-chip-core">{'</>'}</div>
                        </div>
                    </div>

                    <div style={{ position: 'relative', zIndex: 3 }}>
                        <div className="lg-term" aria-hidden="true">
                            <div className="lg-term-bar">
                                <span className="lg-dot" style={{ background: '#ff5f57' }} />
                                <span className="lg-dot" style={{ background: '#febc2e' }} />
                                <span className="lg-dot" style={{ background: '#28c840' }} />
                                <span className="lg-term-name">portal.config.js</span>
                            </div>
                            <pre>
                                <span className="lg-line"><span className="lg-c">// بوابة العقول الهندسية</span></span>
                                <span className="lg-line"><span className="lg-k">const</span> <span className="lg-f">student</span> = {'{'}</span>
                                <span className="lg-line">{'  '}mission: <span className="lg-s">"Build · Learn · Innovate"</span>,</span>
                                <span className="lg-line">{'}'}; <span className="lg-caret" /></span>
                            </pre>
                        </div>

                        <div className="lg-feats">
                            <span className="lg-feat"><i />محاضرات ومصادر</span>
                            <span className="lg-feat"><i />مساعد دراسة ذكي</span>
                            <span className="lg-feat"><i />نقاش وتعليقات</span>
                        </div>
                    </div>
                </aside>

                {/* ===== نموذج تسجيل الدخول ===== */}
                <section className="lg-form-side">
                    <span className="lg-badge"><i />بوابة الطلبة الآمنة</span>
                    <h2 className="lg-h">مرحباً بعودتك 👋</h2>
                    <p className="lg-p">سجّل الدخول ببياناتك الجامعية للوصول إلى المحاضرات والمصادر الدراسية.</p>

                    {errorMsg && (
                        <div className="lg-err" role="alert">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5h.01" />
                            </svg>
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} noValidate={false}>
                        <div className="lg-field">
                            <input
                                id="lg-email"
                                className="lg-in"
                                type="email"
                                required
                                autoComplete="username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder=" "
                                disabled={isLoading}
                            />
                            <label className="lg-lb" htmlFor="lg-email">البريد الإلكتروني الجامعي</label>
                            <span className="lg-ico"><IconMail /></span>
                        </div>

                        <div className="lg-field">
                            <input
                                id="lg-pass"
                                className="lg-in"
                                type={showPass ? 'text' : 'password'}
                                required
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder=" "
                                disabled={isLoading}
                            />
                            <label className="lg-lb" htmlFor="lg-pass">كلمة المرور</label>
                            <span className="lg-ico"><IconLock /></span>
                            <button
                                type="button"
                                className="lg-eye"
                                onClick={() => setShowPass((s) => !s)}
                                aria-label={showPass ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                                tabIndex={-1}
                            >
                                <IconEye off={showPass} />
                            </button>
                        </div>

                        <div className="lg-row">
                            <label className="lg-check">
                                <input type="checkbox" disabled={isLoading} />
                                <span className="lg-box">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                                </span>
                                تذكرني
                            </label>
                            <Link to="/forgot-password" className="lg-link">نسيت كلمة المرور؟</Link>
                        </div>

                        <button type="submit" className="lg-btn" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="lg-spin" />
                                    جاري التحقق...
                                </>
                            ) : (
                                <>
                                    تسجيل الدخول
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
                                </>
                            )}
                        </button>

                        <div className="lg-or">أو</div>

                        <p className="lg-reg">
                            ليس لديك حساب؟ <Link to="/register">إنشاء حساب جديد</Link>
                        </p>
                    </form>

                    <div className="lg-secure"><IconShield />اتصال مشفّر · بياناتك محمية</div>
                </section>
            </div>
        </div>
    );
}
