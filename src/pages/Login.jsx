import React, { useState, useContext, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

.nx {
    --bg: #05060f;
    --violet: #8b5cf6;
    --magenta: #ff3d9a;
    --mint: #10f5b0;
    --blue: #3b82f6;
    --txt: #eef0ff;
    --dim: #8a8fb0;
    --cut: 18px;
    font-family: 'Cairo', system-ui, sans-serif;
    color: var(--txt);
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    background: var(--bg);
    display: grid;
    grid-template-columns: 1.25fr 1fr;
    box-sizing: border-box;
}
.nx *, .nx *::before, .nx *::after { box-sizing: border-box; }

/* ===== خلفية الشفق ===== */
.nx-aurora { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
.nx-blob { position: absolute; border-radius: 50%; filter: blur(90px); opacity: .55; animation: nxDrift 18s ease-in-out infinite alternate; }
.nx-blob.a { width: 520px; height: 520px; background: var(--violet); top: -160px; right: -120px; }
.nx-blob.b { width: 460px; height: 460px; background: var(--blue); bottom: -180px; right: 25%; animation-delay: -6s; opacity: .4; }
.nx-blob.c { width: 380px; height: 380px; background: var(--magenta); bottom: -120px; left: -100px; animation-delay: -11s; opacity: .35; }
.nx-blob.d { width: 260px; height: 260px; background: var(--mint); top: 30%; left: 38%; animation-delay: -3s; opacity: .18; }
@keyframes nxDrift { to { transform: translate(60px, -40px) scale(1.15); } }

.nx-hex {
    position: absolute; inset: 0; z-index: 0; opacity: .5;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0 34L0 84V50' fill='none' stroke='%238b5cf6' stroke-opacity='.18' stroke-width='1'/%3E%3Cpath d='M28 100V66l28-16' fill='none' stroke='%238b5cf6' stroke-opacity='.18'/%3E%3C/svg%3E");
    mask-image: radial-gradient(ellipse at 40% 50%, #000 20%, transparent 75%);
    -webkit-mask-image: radial-gradient(ellipse at 40% 50%, #000 20%, transparent 75%);
}

/* أرقام ثنائية متساقطة */
.nx-bits { position: absolute; inset: 0; z-index: 1; pointer-events: none; overflow: hidden; }
.nx-bit {
    position: absolute; top: -30px; font-family: 'JetBrains Mono', monospace; font-weight: 700;
    color: var(--mint); text-shadow: 0 0 10px var(--mint);
    animation: nxFall linear infinite; opacity: 0;
}
@keyframes nxFall {
    0% { transform: translateY(0); opacity: 0; }
    10% { opacity: .55; }
    90% { opacity: .15; }
    100% { transform: translateY(110vh); opacity: 0; }
}

/* ===== جهة الهيرو ===== */
.nx-hero {
    position: relative; z-index: 2;
    padding: 44px 56px;
    display: flex; flex-direction: column; justify-content: space-between;
    min-height: 100vh;
}
.nx-top { display: flex; align-items: center; justify-content: space-between; }
.nx-brand { display: flex; align-items: center; gap: 14px; }
.nx-hexlogo {
    width: 54px; height: 60px; display: grid; place-items: center;
    clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
    background: linear-gradient(140deg, var(--violet), var(--magenta));
    position: relative;
}
.nx-hexlogo::after {
    content: ''; position: absolute; inset: 2px; background: #0a0b1d;
    clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
}
.nx-hexlogo svg { position: relative; z-index: 2; }
.nx-brand b { display: block; font-size: 18px; font-weight: 800; line-height: 1.2; }
.nx-brand small { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--mint); letter-spacing: 2px; direction: ltr; display: block; text-align: right; }
.nx-live {
    font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 1.5px; color: var(--dim);
    display: inline-flex; align-items: center; gap: 8px; direction: ltr;
    padding: 7px 14px; border: 1px solid rgba(255,255,255,.1);
    clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
    background: rgba(255,255,255,.03);
}
.nx-live i { width: 7px; height: 7px; border-radius: 50%; background: var(--mint); box-shadow: 0 0 10px var(--mint); animation: nxBlink 1.6s infinite; }
@keyframes nxBlink { 50% { opacity: .25; } }

.nx-title { margin: 28px 0 0; }
.nx-title h1 {
    margin: 0; font-size: clamp(34px, 4.2vw, 62px); font-weight: 900; line-height: 1.15; letter-spacing: -1px;
}
.nx-title h1 span {
    background: linear-gradient(90deg, var(--violet), var(--magenta) 55%, var(--mint));
    -webkit-background-clip: text; background-clip: text; color: transparent;
    background-size: 200% 100%; animation: nxShift 6s linear infinite;
}
@keyframes nxShift { to { background-position: -200% 0; } }
.nx-title p { margin: 14px 0 0; color: var(--dim); font-size: 16px; line-height: 1.9; max-width: 460px; }

/* ===== المشهد ثلاثي الأبعاد ===== */
.nx-stage { position: relative; height: 420px; display: grid; place-items: center; perspective: 1100px; }
.nx-ring {
    position: absolute; border-radius: 50%;
    border: 1px dashed rgba(139, 92, 246, .45);
    animation: nxSpin linear infinite;
}
.nx-ring.r1 { width: 300px; height: 300px; animation-duration: 28s; }
.nx-ring.r2 { width: 410px; height: 410px; animation-duration: 42s; animation-direction: reverse; border-color: rgba(16, 245, 176, .3); }
@keyframes nxSpin { to { transform: rotate(360deg); } }
.nx-orb {
    position: absolute; left: 50%; top: 0; transform: translate(-50%, -50%);
}
.nx-orb span {
    display: block; white-space: nowrap;
    font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 500;
    padding: 6px 12px; color: #fff;
    background: rgba(14, 16, 40, .85);
    border: 1px solid rgba(139, 92, 246, .6);
    clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
    animation: nxSpin linear infinite reverse;
}
.nx-ring.r1 .nx-orb span { animation-duration: 28s; }
.nx-ring.r2 .nx-orb span { animation-duration: 42s; animation-direction: normal; border-color: rgba(16,245,176,.6); }

.nx-scene { width: 170px; height: 170px; transform-style: preserve-3d; animation: nxCube 22s linear infinite; position: relative; }
@keyframes nxCube {
    from { transform: rotateX(-24deg) rotateY(0deg); }
    to   { transform: rotateX(-24deg) rotateY(360deg); }
}
.nx-face {
    position: absolute; inset: 0; display: grid; place-items: center;
    border: 1.5px solid rgba(139, 92, 246, .9);
    background: linear-gradient(135deg, rgba(139,92,246,.22), rgba(255,61,154,.1));
    box-shadow: inset 0 0 30px rgba(139,92,246,.35), 0 0 22px rgba(139,92,246,.25);
    font-family: 'JetBrains Mono', monospace; font-size: 40px; font-weight: 700; color: #fff;
    text-shadow: 0 0 16px var(--violet);
}
.nx-face.f1 { transform: translateZ(85px); }
.nx-face.f2 { transform: rotateY(90deg) translateZ(85px); }
.nx-face.f3 { transform: rotateY(180deg) translateZ(85px); }
.nx-face.f4 { transform: rotateY(-90deg) translateZ(85px); }
.nx-face.f5 { transform: rotateX(90deg) translateZ(85px); border-color: rgba(16,245,176,.9); text-shadow: 0 0 16px var(--mint); }
.nx-face.f6 { transform: rotateX(-90deg) translateZ(85px); border-color: rgba(255,61,154,.9); text-shadow: 0 0 16px var(--magenta); }
.nx-core {
    position: absolute; left: 50%; top: 50%; width: 54px; height: 54px; margin: -27px 0 0 -27px;
    transform-style: preserve-3d; animation: nxCore 9s linear infinite;
}
@keyframes nxCore { to { transform: rotateX(360deg) rotateY(-360deg); } }
.nx-core i { position: absolute; inset: 0; border: 1.5px solid var(--mint); background: rgba(16,245,176,.12); box-shadow: 0 0 18px rgba(16,245,176,.6); }
.nx-core i:nth-child(1) { transform: translateZ(27px); } .nx-core i:nth-child(2) { transform: rotateY(90deg) translateZ(27px); }
.nx-core i:nth-child(3) { transform: rotateY(180deg) translateZ(27px); } .nx-core i:nth-child(4) { transform: rotateY(-90deg) translateZ(27px); }
.nx-core i:nth-child(5) { transform: rotateX(90deg) translateZ(27px); } .nx-core i:nth-child(6) { transform: rotateX(-90deg) translateZ(27px); }
.nx-shadow {
    position: absolute; bottom: 14px; width: 200px; height: 30px; border-radius: 50%;
    background: radial-gradient(closest-side, rgba(139,92,246,.55), transparent);
    animation: nxShadow 3s ease-in-out infinite alternate;
}
@keyframes nxShadow { to { transform: scale(.78); opacity: .6; } }

.nx-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.nx-stat {
    padding: 16px 18px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
    transition: background .3s, transform .3s;
}
.nx-stat:hover { background: rgba(139,92,246,.14); transform: translateY(-3px); }
.nx-stat em { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--mint); letter-spacing: 1px; display: block; margin-bottom: 6px; direction: ltr; text-align: right; }
.nx-stat b { font-size: 14.5px; font-weight: 700; }

/* ===== جهة النموذج ===== */
.nx-side { position: relative; z-index: 3; display: grid; place-items: center; padding: 32px 40px 32px 56px; }
.nx-frame {
    width: 100%; max-width: 440px; padding: 1.5px;
    background: linear-gradient(150deg, var(--violet), rgba(255,255,255,.08) 40%, rgba(255,255,255,.08) 60%, var(--magenta));
    clip-path: polygon(0 var(--cut), var(--cut) 0, calc(100% - var(--cut)) 0, 100% var(--cut), 100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, var(--cut) 100%, 0 calc(100% - var(--cut)));
    filter: drop-shadow(0 30px 60px rgba(139, 92, 246, .35));
    animation: nxIn .9s cubic-bezier(.2,.8,.2,1) both;
}
@keyframes nxIn { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: none; } }
.nx-panel {
    padding: 34px 32px 26px;
    background: linear-gradient(180deg, rgba(16, 18, 44, .94), rgba(8, 9, 24, .96));
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    clip-path: polygon(0 calc(var(--cut) - 1px), calc(var(--cut) - 1px) 0, calc(100% - var(--cut) + 1px) 0, 100% calc(var(--cut) - 1px), 100% calc(100% - var(--cut) + 1px), calc(100% - var(--cut) + 1px) 100%, calc(var(--cut) - 1px) 100%, 0 calc(100% - var(--cut) + 1px));
}

.nx-tabs {
    display: grid; grid-template-columns: 1fr 1fr; gap: 4px; padding: 4px; margin-bottom: 26px;
    background: rgba(255,255,255,.05);
    clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px);
}
.nx-tab { text-align: center; padding: 10px; font-size: 14px; font-weight: 700; color: var(--dim); text-decoration: none; transition: color .2s; }
.nx-tab:hover { color: #fff; }
.nx-tab.on {
    color: #fff; background: linear-gradient(90deg, var(--violet), #a855f7);
    clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);
    box-shadow: 0 0 24px rgba(139,92,246,.5);
}

.nx-panel h2 { margin: 0 0 6px; font-size: 27px; font-weight: 900; }
.nx-panel .sub { margin: 0 0 24px; color: var(--dim); font-size: 14px; line-height: 1.8; }

.nx-err {
    display: flex; gap: 10px; align-items: center; margin-bottom: 18px; padding: 11px 14px;
    background: rgba(255, 61, 90, .1); border: 1px solid rgba(255, 61, 90, .45); color: #ff8da1;
    font-size: 13.5px; font-weight: 700;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    animation: nxShake .45s;
}
@keyframes nxShake { 25%,75% { transform: translateX(-6px); } 50% { transform: translateX(6px); } }

.nx-fld {
    --c: rgba(255,255,255,.14);
    padding: 1px; margin-bottom: 14px; background: var(--c);
    clip-path: polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
    transition: background .3s;
}
.nx-fld:focus-within { background: linear-gradient(100deg, var(--violet), var(--mint)); }
.nx-fld-in {
    display: flex; align-items: center; gap: 12px; padding: 0 14px; height: 64px; background: #0a0c20;
    clip-path: polygon(0 11px, 11px 0, 100% 0, 100% calc(100% - 11px), calc(100% - 11px) 100%, 0 100%);
}
.nx-ic { color: #6c71a0; display: grid; transition: color .3s; flex-shrink: 0; }
.nx-fld:focus-within .nx-ic { color: var(--mint); }
.nx-col { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.nx-col label { font-size: 11.5px; font-weight: 700; color: var(--dim); margin-bottom: 2px; transition: color .3s; }
.nx-fld:focus-within .nx-col label { color: var(--mint); }
.nx-col input {
    width: 100%; background: transparent; border: 0; outline: 0; color: #fff; font-size: 15px;
    font-family: 'JetBrains Mono', 'Cairo', monospace; padding: 0; direction: ltr; text-align: right;
}
.nx-col input::placeholder { color: #4a4f78; }
.nx-eye { background: transparent; border: 0; color: #6c71a0; cursor: pointer; display: grid; padding: 6px; transition: color .2s; }
.nx-eye:hover { color: #fff; }

.nx-row { display: flex; justify-content: space-between; align-items: center; margin: 4px 0 22px; font-size: 13px; }
.nx-chk { display: inline-flex; align-items: center; gap: 9px; color: var(--dim); font-weight: 600; cursor: pointer; user-select: none; }
.nx-chk input { position: absolute; opacity: 0; pointer-events: none; }
.nx-chk .bx {
    width: 18px; height: 18px; border: 1.5px solid #4a4f78; display: grid; place-items: center; transition: all .2s;
    clip-path: polygon(0 5px, 5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%);
}
.nx-chk .bx svg { opacity: 0; transform: scale(.4); transition: all .2s; }
.nx-chk input:checked + .bx { background: var(--mint); border-color: var(--mint); }
.nx-chk input:checked + .bx svg { opacity: 1; transform: none; }
.nx-chk input:focus-visible + .bx { outline: 2px solid var(--violet); outline-offset: 2px; }
.nx-forgot { color: #b9a4ff; font-weight: 700; text-decoration: none; transition: color .2s; }
.nx-forgot:hover { color: var(--mint); }

.nx-go {
    position: relative; width: 100%; height: 58px; border: 0; cursor: pointer; overflow: hidden;
    color: #fff; font-family: inherit; font-size: 16px; font-weight: 800;
    background: linear-gradient(100deg, var(--violet), var(--magenta), var(--violet));
    background-size: 200% 100%; animation: nxGrad 5s linear infinite;
    clip-path: polygon(16px 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
    display: flex; align-items: center; justify-content: center; gap: 12px;
    transition: transform .2s, filter .2s;
}
@keyframes nxGrad { to { background-position: -200% 0; } }
.nx-go::after {
    content: ''; position: absolute; top: 0; bottom: 0; width: 50px; left: -90px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent); transform: skewX(-22deg);
}
.nx-go:hover:not(:disabled)::after { left: calc(100% + 40px); transition: left .7s; }
.nx-go:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.12) drop-shadow(0 12px 22px rgba(255,61,154,.45)); }
.nx-go:active:not(:disabled) { transform: translateY(0); }
.nx-go:disabled { opacity: .75; cursor: not-allowed; }
.nx-go:focus-visible { outline: 2px solid var(--mint); outline-offset: 3px; }
.nx-loader { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 50%; animation: nxSpin .7s linear infinite; }

.nx-foot {
    margin-top: 22px; padding-top: 16px; border-top: 1px dashed rgba(255,255,255,.12);
    display: flex; justify-content: space-between; align-items: center;
    font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: #5d6291; letter-spacing: 1px; direction: ltr;
}
.nx-foot span { display: inline-flex; align-items: center; gap: 6px; }
.nx-foot i { width: 6px; height: 6px; background: var(--mint); border-radius: 50%; box-shadow: 0 0 8px var(--mint); }

/* ===== استجابة ===== */
@media (max-width: 980px) {
    .nx { grid-template-columns: 1fr; }
    .nx-hero { display: none; }
    .nx-side { padding: 24px 16px; min-height: 100vh; }
}
@media (prefers-reduced-motion: reduce) {
    .nx *, .nx *::before, .nx *::after { animation-duration: .001s !important; animation-iteration-count: 1 !important; }
}
`;

/* أرقام عشوائية ثابتة (لا تتغير بين إعادة الرسم) */
function makeBits(n) {
    let s = 7;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: n }, (_, i) => ({
        id: i,
        ch: rnd() > 0.5 ? '1' : '0',
        left: `${Math.round(rnd() * 100)}%`,
        size: 11 + Math.round(rnd() * 9),
        dur: 9 + rnd() * 11,
        delay: -rnd() * 18,
    }));
}

const IcMail = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" />
    </svg>
);
const IcKey = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="15" r="4" /><path d="m11 12 8-8M16 7l3 3M14 9l2 2" />
    </svg>
);
const IcEye = ({ off }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />
        {off && <path d="M4 4l16 16" />}
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
    const bits = useMemo(() => makeBits(26), []);

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
        <div className="nx" dir="rtl">
            <style>{css}</style>

            {/* الخلفية */}
            <div className="nx-aurora" aria-hidden="true">
                <span className="nx-blob a" /><span className="nx-blob b" /><span className="nx-blob c" /><span className="nx-blob d" />
            </div>
            <div className="nx-hex" aria-hidden="true" />
            <div className="nx-bits" aria-hidden="true">
                {bits.map((b) => (
                    <span key={b.id} className="nx-bit" style={{ left: b.left, fontSize: b.size, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}>{b.ch}</span>
                ))}
            </div>

            {/* ===== الهيرو ===== */}
            <section className="nx-hero">
                <div>
                    <div className="nx-top">
                        <div className="nx-brand">
                            <div className="nx-hexlogo">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10f5b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12" />
                                </svg>
                            </div>
                            <div>
                                <b>كلية هندسة الحاسوب</b>
                                <small>CE · STUDENT PORTAL</small>
                            </div>
                        </div>
                        <div className="nx-live"><i />SYSTEM ONLINE</div>
                    </div>

                    <div className="nx-title">
                        <h1>هنا تُبنى <span>عقول المستقبل</span><br />سطراً بعد سطر</h1>
                        <p>منصتك الأكاديمية للمحاضرات والمصادر والنقاش والمساعد الذكي، كل ما يحتاجه مهندس الحاسوب في مكان واحد.</p>
                    </div>
                </div>

                <div className="nx-stage" aria-hidden="true">
                    <div className="nx-ring r1">
                        <div className="nx-orb"><span>Algorithms</span></div>
                        <div className="nx-orb" style={{ top: '100%' }}><span>Networks</span></div>
                    </div>
                    <div className="nx-ring r2">
                        <div className="nx-orb" style={{ left: '14.6%', top: '25%' }}><span>AI / ML</span></div>
                        <div className="nx-orb" style={{ left: '85.4%', top: '75%' }}><span>Embedded</span></div>
                        <div className="nx-orb" style={{ left: '85.4%', top: '25%' }}><span>Databases</span></div>
                    </div>

                    <div className="nx-scene">
                        <div className="nx-face f1">{'</>'}</div>
                        <div className="nx-face f2">01</div>
                        <div className="nx-face f3">{'{ }'}</div>
                        <div className="nx-face f4">AI</div>
                        <div className="nx-face f5">&gt;_</div>
                        <div className="nx-face f6">CPU</div>
                        <div className="nx-core"><i /><i /><i /><i /><i /><i /></div>
                    </div>
                    <div className="nx-shadow" />
                </div>

                <div className="nx-stats">
                    <div className="nx-stat"><em>01 / LECTURES</em><b>محاضرات مرتبة بالمراحل</b></div>
                    <div className="nx-stat"><em>02 / AI ASSIST</em><b>مساعد دراسة ذكي</b></div>
                    <div className="nx-stat"><em>03 / COMMUNITY</em><b>نقاش وتعليقات الطلبة</b></div>
                </div>
            </section>

            {/* ===== بطاقة الدخول ===== */}
            <section className="nx-side">
                <div className="nx-frame">
                    <div className="nx-panel">
                        <div className="nx-tabs">
                            <span className="nx-tab on">تسجيل الدخول</span>
                            <Link to="/register" className="nx-tab">حساب جديد</Link>
                        </div>

                        <h2>أهلاً بعودتك</h2>
                        <p className="sub">أدخل بياناتك الجامعية لفتح بوابة المحاضرات.</p>

                        {errorMsg && (
                            <div className="nx-err" role="alert">
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4M12 17h.01" />
                                </svg>
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className="nx-fld">
                                <div className="nx-fld-in">
                                    <span className="nx-ic"><IcMail /></span>
                                    <div className="nx-col">
                                        <label htmlFor="nx-email">البريد الإلكتروني الجامعي</label>
                                        <input
                                            id="nx-email"
                                            type="email"
                                            required
                                            autoComplete="username"
                                            placeholder="name@university.edu"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="nx-fld">
                                <div className="nx-fld-in">
                                    <span className="nx-ic"><IcKey /></span>
                                    <div className="nx-col">
                                        <label htmlFor="nx-pass">كلمة المرور</label>
                                        <input
                                            id="nx-pass"
                                            type={showPass ? 'text' : 'password'}
                                            required
                                            autoComplete="current-password"
                                            placeholder="••••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="nx-eye"
                                        tabIndex={-1}
                                        onClick={() => setShowPass((s) => !s)}
                                        aria-label={showPass ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                                    >
                                        <IcEye off={showPass} />
                                    </button>
                                </div>
                            </div>

                            <div className="nx-row">
                                <label className="nx-chk">
                                    <input type="checkbox" disabled={isLoading} />
                                    <span className="bx">
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#05060f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                                    </span>
                                    تذكرني
                                </label>
                                <Link to="/forgot-password" className="nx-forgot">نسيت كلمة المرور؟</Link>
                            </div>

                            <button type="submit" className="nx-go" disabled={isLoading}>
                                {isLoading ? (
                                    <><span className="nx-loader" />جاري التحقق...</>
                                ) : (
                                    <>
                                        دخول إلى المنصة
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="nx-foot">
                            <span><i />TLS ENCRYPTED</span>
                            <span>v2.0 · CE-PORTAL</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
