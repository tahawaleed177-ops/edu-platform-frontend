import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.lg {
    --bg: #f4f1ea;
    --paper: #fbfaf6;
    --ink: #12141b;
    --mute: #6d6b66;
    --line: #dcd6ca;
    --navy: #161d3a;
    --navy2: #222b55;
    --deep: #0d1124;
    --blue: #3a5bd9;
    --amber: #f2b441;
    --coral: #e46b4a;
    --cream: #efe8d8;
    font-family: 'IBM Plex Sans Arabic', system-ui, sans-serif;
    background: var(--bg);
    color: var(--ink);
    min-height: 100vh;
    display: grid;
    grid-template-columns: minmax(440px, 1fr) 1.15fr;
    box-sizing: border-box;
}
.lg *, .lg *::before, .lg *::after { box-sizing: border-box; }
.lg .mono { font-family: 'IBM Plex Mono', monospace; direction: ltr; }

/* ========== جانب النموذج ========== */
.lg-side { display: flex; flex-direction: column; padding: 34px clamp(24px, 5vw, 76px); min-height: 100vh; }

.lg-brand { display: flex; align-items: center; gap: 12px; }
.lg-mark { position: relative; width: 42px; height: 42px; background: var(--navy); border-radius: 10px; overflow: hidden; flex: none; }
.lg-mark::before { content: ''; position: absolute; inset: 0 0 50% 50%; background: var(--amber); border-radius: 0 0 0 100%; }
.lg-mark::after { content: ''; position: absolute; width: 12px; height: 12px; left: 8px; bottom: 8px; background: var(--blue); border-radius: 50%; }
.lg-brand b { display: block; font-size: 15px; font-weight: 700; line-height: 1.3; }
.lg-brand small { display: block; font-size: 10.5px; color: var(--mute); letter-spacing: 1.4px; text-transform: uppercase; }

.lg-main { flex: 1; display: grid; place-items: center; padding: 40px 0; }
.lg-box { width: 100%; max-width: 410px; }
.lg-box > * { animation: lgUp .7s cubic-bezier(.2,.8,.2,1) both; }
.lg-box > *:nth-child(2) { animation-delay: .05s; }
.lg-box > *:nth-child(3) { animation-delay: .1s; }
.lg-box > *:nth-child(4) { animation-delay: .15s; }
.lg-box > *:nth-child(5) { animation-delay: .2s; }
.lg-box > *:nth-child(6) { animation-delay: .25s; }
@keyframes lgUp { from { opacity: 0; transform: translateY(14px); } }

.lg-eyebrow { display: flex; align-items: center; gap: 10px; justify-content: flex-end; font-size: 11.5px; letter-spacing: 2px; color: var(--blue); font-weight: 600; margin-bottom: 18px; }
.lg-eyebrow::before { content: ''; width: 28px; height: 2px; background: var(--blue); }
.lg h1 { margin: 0 0 10px; font-size: 36px; font-weight: 700; letter-spacing: -.3px; line-height: 1.25; }
.lg-sub { margin: 0 0 30px; color: var(--mute); font-size: 15px; line-height: 1.8; text-wrap: pretty; }

.lg-tabs { display: flex; gap: 28px; border-bottom: 1px solid var(--line); margin-bottom: 28px; }
.lg-tab { position: relative; padding: 0 0 12px; font-size: 14.5px; font-weight: 600; color: var(--mute); text-decoration: none; transition: color .2s; }
.lg-tab:hover { color: var(--ink); }
.lg-tab.on { color: var(--ink); }
.lg-tab.on::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: var(--ink); }

.lg-err {
    display: flex; gap: 10px; align-items: flex-start; margin-bottom: 20px; padding: 12px 14px; border-radius: 12px;
    background: #fbebe5; border: 1px solid #f0c4b4; color: #a33c21; font-size: 13.5px; font-weight: 600; line-height: 1.6;
    animation: lgShake .4s;
}
.lg-err svg { flex: none; margin-top: 2px; }
@keyframes lgShake { 25%,75% { transform: translateX(-5px); } 50% { transform: translateX(5px); } }

.lg-fld { margin-bottom: 18px; }
.lg-fld label { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.lg-fld label a { font-weight: 600; color: var(--blue); text-decoration: none; }
.lg-fld label a:hover { text-decoration: underline; text-underline-offset: 3px; }
.lg-wrap { position: relative; }
.lg-in {
    width: 100%; height: 54px; padding: 0 48px; border-radius: 12px; border: 1px solid var(--line); background: var(--paper);
    color: var(--ink); font-size: 15px; font-family: 'IBM Plex Mono', 'IBM Plex Sans Arabic', monospace; direction: ltr; text-align: right;
    outline: 0; transition: border-color .2s, box-shadow .2s, background .2s;
}
.lg-in::placeholder { color: #aaa69c; font-family: 'IBM Plex Sans Arabic', sans-serif; }
.lg-in:hover { border-color: #c6bfb0; }
.lg-in:focus { border-color: var(--blue); background: #fff; box-shadow: 0 0 0 4px rgba(58,91,217,.13); }
.lg-in:disabled { opacity: .6; }
.lg-ic { position: absolute; right: 16px; top: 16px; color: #9c978b; display: grid; pointer-events: none; transition: color .2s; }
.lg-wrap:focus-within .lg-ic { color: var(--blue); }
.lg-eye { position: absolute; left: 10px; top: 11px; width: 32px; height: 32px; display: grid; place-items: center; border: 0; background: transparent; color: #9c978b; border-radius: 8px; cursor: pointer; transition: background .2s, color .2s; }
.lg-eye:hover { background: #eee9de; color: var(--ink); }

.lg-row { display: flex; align-items: center; margin: 4px 0 26px; }
.lg-chk { display: inline-flex; align-items: center; gap: 10px; font-size: 13.5px; color: var(--mute); font-weight: 500; cursor: pointer; user-select: none; }
.lg-chk input { position: absolute; opacity: 0; pointer-events: none; }
.lg-chk .bx { position: relative; width: 19px; height: 19px; border: 1.5px solid #bdb6a6; border-radius: 5px; background: var(--paper); transition: all .2s; }
.lg-chk .bx::after { content: ''; position: absolute; left: 5.5px; top: 2px; width: 5px; height: 10px; border: solid var(--cream); border-width: 0 2px 2px 0; transform: rotate(45deg) scale(0); transition: transform .2s; }
.lg-chk input:checked + .bx { background: var(--ink); border-color: var(--ink); }
.lg-chk input:checked + .bx::after { transform: rotate(45deg) scale(1); }
.lg-chk input:focus-visible + .bx { box-shadow: 0 0 0 4px rgba(58,91,217,.2); }

.lg-go {
    width: 100%; height: 56px; border: 0; border-radius: 12px; cursor: pointer; background: var(--ink); color: var(--cream);
    font-family: inherit; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: space-between;
    padding: 0 22px 0 8px; transition: background .25s, transform .15s;
}
.lg-go:hover:not(:disabled) { background: var(--navy2); }
.lg-go:active:not(:disabled) { transform: scale(.99); }
.lg-go:disabled { cursor: wait; background: var(--navy2); }
.lg-go:focus-visible { outline: 2px solid var(--blue); outline-offset: 3px; }
.lg-go .arr { width: 40px; height: 40px; border-radius: 9px; background: var(--amber); color: var(--ink); display: grid; place-items: center; transition: transform .3s cubic-bezier(.2,.8,.2,1); }
.lg-go:hover:not(:disabled) .arr { transform: translateX(-4px); }
.lg-spin { width: 18px; height: 18px; border-radius: 50%; border: 2.5px solid rgba(18,20,27,.25); border-top-color: var(--ink); animation: lgRot .7s linear infinite; }
@keyframes lgRot { to { transform: rotate(360deg); } }

.lg-alt { margin-top: 22px; text-align: center; font-size: 14px; color: var(--mute); }
.lg-alt a { color: var(--ink); font-weight: 700; text-decoration: none; border-bottom: 2px solid var(--amber); padding-bottom: 1px; }
.lg-alt a:hover { border-color: var(--blue); }

.lg-foot { display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--mute); letter-spacing: .6px; }
.lg-foot span { display: inline-flex; align-items: center; gap: 7px; }
.lg-foot i { width: 7px; height: 7px; border-radius: 50%; background: #2fa36b; box-shadow: 0 0 0 3px rgba(47,163,107,.18); }

/* ========== اللوحة الفنية ========== */
.lg-art {
    position: relative; margin: 14px; border-radius: 24px; background: var(--navy); color: var(--cream); overflow: hidden;
    display: flex; flex-direction: column; justify-content: space-between; gap: 32px; padding: clamp(28px, 3.4vw, 48px);
}
.lg-art.bad { --amber: var(--coral); }
.lg-art::before {
    content: ''; position: absolute; inset: 0; pointer-events: none; opacity: .5;
    background-image: radial-gradient(rgba(239,232,216,.13) 1px, transparent 1.2px); background-size: 22px 22px;
}
.lg-art > * { position: relative; }
.lg-art-top { display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; letter-spacing: 1.6px; color: rgba(239,232,216,.6); }
.lg-pill { padding: 6px 12px; border: 1px solid rgba(239,232,216,.2); border-radius: 99px; color: var(--cream); }

.lg-grid {
    align-self: center; width: min(100%, 52vh, 520px); display: grid; grid-template-columns: repeat(4, 1fr);
    border-radius: 6px; overflow: hidden; box-shadow: 0 40px 80px -30px rgba(0,0,0,.6);
}
.lg-tile { position: relative; aspect-ratio: 1; overflow: hidden; background: var(--tb); transition: transform 1s cubic-bezier(.7,0,.2,1), background .6s; }
.lg-art.busy .lg-tile { transition-duration: .45s; }
.lg-tile > i { position: absolute; display: block; background: var(--tf); transition: background .6s, border-color .6s; animation: lgPop .8s cubic-bezier(.2,.9,.2,1.1) both; animation-delay: var(--dl); }
@keyframes lgPop { from { opacity: 0; transform: scale(.3); } }
.k-q > i     { inset: 0; border-radius: 100% 0 0 0; }
.k-half > i  { left: 0; right: 0; bottom: 0; height: 50%; border-radius: 999px 999px 0 0; }
.k-circ > i  { inset: 13%; border-radius: 50%; }
.k-ring > i  { inset: 16%; border-radius: 50%; background: transparent; border: 12px solid var(--tf); }
.k-tri > i   { inset: 0; clip-path: polygon(0 0, 100% 100%, 0 100%); }
.k-leaf > i  { inset: 0; border-radius: 0 100% 0 100%; }
.k-sq > i    { inset: 30%; }
.k-stripe > i{ inset: 0; background: repeating-linear-gradient(45deg, var(--tf) 0 7px, transparent 7px 16px); }
.k-dots > i  { inset: 12%; background: radial-gradient(var(--tf) 2.6px, transparent 3px) 0 0 / 25% 25%; }
.k-plain > i { display: none; }

.lg-art-bottom h3 { margin: 0 0 22px; font-size: clamp(28px, 2.8vw, 40px); font-weight: 700; line-height: 1.3; letter-spacing: -.3px; }
.lg-art-bottom h3 em { font-style: normal; color: var(--amber); transition: color .6s; }
.lg-feats { list-style: none; margin: 0; padding: 22px 0 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; border-top: 1px solid rgba(239,232,216,.16); }
.lg-feats li { font-size: 14px; font-weight: 500; line-height: 1.6; color: rgba(239,232,216,.85); }
.lg-feats li span { display: block; font-size: 11px; color: var(--amber); letter-spacing: 1px; margin-bottom: 4px; text-align: right; transition: color .6s; }

/* شريط الأشكال للجوال */
.lg-strip { display: none; }

@media (max-width: 960px) {
    .lg { grid-template-columns: 1fr; }
    .lg-art { display: none; }
    .lg-side { padding: 22px 20px 26px; }
    .lg-main { padding: 26px 0; }
    .lg-strip { display: grid; grid-template-columns: repeat(8, 1fr); border-radius: 8px; overflow: hidden; margin-bottom: 30px; }
    .lg h1 { font-size: 30px; }
}
@media (prefers-reduced-motion: reduce) {
    .lg *, .lg *::before, .lg *::after { animation-duration: .001s !important; transition: none !important; }
}
`;

// لوحة أشكال هندسية (باوهاوس) — كل مربع شكل ولونان
const TILES = [
    { k: 'q',      b: 'var(--blue)',  f: 'var(--amber)' },
    { k: 'circ',   b: 'var(--cream)', f: 'var(--navy)' },
    { k: 'stripe', b: 'var(--navy2)', f: 'var(--blue)' },
    { k: 'half',   b: 'var(--amber)', f: 'var(--deep)' },
    { k: 'plain',  b: 'var(--cream)', f: 'var(--cream)' },
    { k: 'leaf',   b: 'var(--deep)',  f: 'var(--blue)' },
    { k: 'dots',   b: 'var(--amber)', f: 'var(--deep)' },
    { k: 'tri',    b: 'var(--cream)', f: 'var(--blue)' },
    { k: 'ring',   b: 'var(--navy2)', f: 'var(--amber)' },
    { k: 'sq',     b: 'var(--blue)',  f: 'var(--cream)' },
    { k: 'q',      b: 'var(--cream)', f: 'var(--coral)' },
    { k: 'circ',   b: 'var(--deep)',  f: 'var(--cream)' },
    { k: 'half',   b: 'var(--deep)',  f: 'var(--cream)' },
    { k: 'tri',    b: 'var(--amber)', f: 'var(--navy2)' },
    { k: 'plain',  b: 'var(--blue)',  f: 'var(--blue)' },
    { k: 'dots',   b: 'var(--cream)', f: 'var(--blue)' },
];
const STRIP = [0, 1, 3, 5, 8, 9, 10, 13];

const IcMail = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 8 8 6 8-6" />
    </svg>
);
const IcLock = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10" width="16" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 15v2" />
    </svg>
);
const IcEye = ({ off }) => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />
        {off && <path d="M4 4l16 16" />}
    </svg>
);

function Tile({ t, rot = 0, i = 0 }) {
    return (
        <div className={`lg-tile k-${t.k}`} style={{ '--tb': t.b, '--tf': t.f, transform: `rotate(${rot}deg)` }}>
            <i style={{ '--dl': `${0.15 + i * 0.045}s` }} />
        </div>
    );
}

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rots, setRots] = useState(() => TILES.map(() => 0));

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const loadingRef = useRef(false);
    loadingRef.current = isLoading;

    // تدوير مربع عشوائي كل فترة — أسرع أثناء التحقق
    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let timer;
        const tick = () => {
            setRots((r) => {
                const n = r.slice();
                const count = loadingRef.current ? 3 : 1;
                for (let c = 0; c < count; c++) {
                    const idx = Math.floor(Math.random() * n.length);
                    n[idx] += 90;
                }
                return n;
            });
            timer = setTimeout(tick, loadingRef.current ? 380 : 2200);
        };
        timer = setTimeout(tick, 1400);
        return () => clearTimeout(timer);
    }, []);

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

    const artState = isLoading ? 'busy' : errorMsg ? 'bad' : '';

    return (
        <div className="lg" dir="rtl">
            <style>{css}</style>

            {/* ===== النموذج ===== */}
            <section className="lg-side">
                <header className="lg-brand">
                    <div className="lg-mark" aria-hidden="true" />
                    <div>
                        <b>كلية هندسة الحاسوب</b>
                        <small className="mono">College of Computer Engineering</small>
                    </div>
                </header>

                <main className="lg-main">
                    <div className="lg-box">
                        <div className="lg-strip" aria-hidden="true">
                            {STRIP.map((ti, i) => <Tile key={i} t={TILES[ti]} rot={rots[ti]} i={i} />)}
                        </div>

                        <div className="lg-eyebrow mono">STUDENT PORTAL</div>
                        <h1>أهلاً بعودتك</h1>
                        <p className="lg-sub">سجّل الدخول ببريدك الجامعي للوصول إلى المحاضرات والمساعد الدراسي ونقاشات زملائك.</p>

                        <nav className="lg-tabs">
                            <span className="lg-tab on">تسجيل الدخول</span>
                            <Link to="/register" className="lg-tab">إنشاء حساب</Link>
                        </nav>

                        <div>
                            {errorMsg && (
                                <div className="lg-err" role="alert">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="9" /><path d="M12 8v4.5M12 16h.01" />
                                    </svg>
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            <form onSubmit={handleLogin} noValidate={false}>
                                <div className="lg-fld">
                                    <label htmlFor="lg-email">البريد الإلكتروني الجامعي</label>
                                    <div className="lg-wrap">
                                        <span className="lg-ic"><IcMail /></span>
                                        <input
                                            id="lg-email"
                                            className="lg-in"
                                            type="email"
                                            required
                                            autoComplete="username"
                                            placeholder="name@uni.edu.iq"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="lg-fld">
                                    <label htmlFor="lg-pass">
                                        كلمة المرور
                                        <Link to="/forgot-password">نسيت كلمة المرور؟</Link>
                                    </label>
                                    <div className="lg-wrap">
                                        <span className="lg-ic"><IcLock /></span>
                                        <input
                                            id="lg-pass"
                                            className="lg-in"
                                            type={showPass ? 'text' : 'password'}
                                            required
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className="lg-eye"
                                            onClick={() => setShowPass((s) => !s)}
                                            aria-label={showPass ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                                        >
                                            <IcEye off={showPass} />
                                        </button>
                                    </div>
                                </div>

                                <div className="lg-row">
                                    <label className="lg-chk">
                                        <input type="checkbox" disabled={isLoading} />
                                        <span className="bx" />
                                        تذكرني على هذا الجهاز
                                    </label>
                                </div>

                                <button type="submit" className="lg-go" disabled={isLoading}>
                                    <span>{isLoading ? 'جاري التحقق…' : 'تسجيل الدخول'}</span>
                                    <span className="arr">
                                        {isLoading ? (
                                            <span className="lg-spin" />
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
                                        )}
                                    </span>
                                </button>
                            </form>
                        </div>

                        <p className="lg-alt">طالب جديد؟ <Link to="/register">أنشئ حسابك الآن</Link></p>
                    </div>
                </main>

                <footer className="lg-foot">
                    <span className="mono">© 2026 CE PORTAL</span>
                    <span><i />اتصال آمن ومشفّر</span>
                </footer>
            </section>

            {/* ===== اللوحة الفنية ===== */}
            <aside className={`lg-art ${artState}`} aria-hidden="true">
                <div className="lg-art-top mono">
                    <span>CE / PORTAL — v4.0</span>
                    <span className="lg-pill">FALL 2026</span>
                </div>

                <div className="lg-grid">
                    {TILES.map((t, i) => <Tile key={i} t={t} rot={rots[i]} i={i} />)}
                </div>

                <div className="lg-art-bottom">
                    <h3>صمّم. برمج.<br /><em>ابتكر المستقبل.</em></h3>
                    <ul className="lg-feats">
                        <li><span className="mono">01</span>محاضرات مرتبة حسب المراحل</li>
                        <li><span className="mono">02</span>مساعد دراسة ذكي</li>
                        <li><span className="mono">03</span>نقاش وتعليقات الطلبة</li>
                    </ul>
                </div>
            </aside>
        </div>
    );
}
