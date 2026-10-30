import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Space+Grotesk:wght@400;500;700&display=swap');

@property --ang { syntax: '<angle>'; initial-value: 0deg; inherits: false; }

.fx {
    --bg: #03030b;
    --cyan: #00e5ff;
    --lime: #c6ff3d;
    --violet: #7c5cff;
    --pink: #ff4fa3;
    --txt: #f2f4ff;
    --dim: #8b90b8;
    --mx: 0; --my: 0; --px: 50%; --py: 40%;
    font-family: 'Cairo', system-ui, sans-serif;
    color: var(--txt);
    background: var(--bg);
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    display: grid;
    place-items: center;
    padding: 90px 16px 110px;
    box-sizing: border-box;
    isolation: isolate;
}
.fx *, .fx *::before, .fx *::after { box-sizing: border-box; }

/* ===== الخلفية ===== */
.fx-glow {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background:
        radial-gradient(600px circle at var(--px) var(--py), rgba(0,229,255,.16), transparent 60%),
        radial-gradient(900px circle at 85% 10%, rgba(124,92,255,.22), transparent 60%),
        radial-gradient(800px circle at 10% 90%, rgba(255,79,163,.16), transparent 60%);
}

/* أرضية شبكية بمنظور */
.fx-floor {
    position: absolute; left: -50%; right: -50%; bottom: -8%; height: 62%; z-index: 0;
    perspective: 500px; pointer-events: none;
    mask-image: linear-gradient(to top, #000 15%, transparent 92%);
    -webkit-mask-image: linear-gradient(to top, #000 15%, transparent 92%);
}
.fx-floor i {
    position: absolute; inset: 0; transform: rotateX(68deg); transform-origin: bottom;
    background-image:
        linear-gradient(rgba(0,229,255,.55) 1px, transparent 1px),
        linear-gradient(90deg, rgba(124,92,255,.5) 1px, transparent 1px);
    background-size: 64px 64px;
    animation: fxRun 3.2s linear infinite;
}
@keyframes fxRun { to { background-position: 0 64px, 0 0; } }

/* كرة سائلة متحولة خلف البطاقة */
.fx-blob {
    position: absolute; z-index: 0; width: 640px; height: 640px; left: 50%; top: 50%;
    margin: -320px 0 0 -320px; pointer-events: none;
    background: conic-gradient(from var(--ang), var(--cyan), var(--violet), var(--pink), var(--lime), var(--cyan));
    filter: blur(70px); opacity: .42;
    animation: fxMorph 14s ease-in-out infinite, fxAng 10s linear infinite;
}
@keyframes fxMorph {
    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    33% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
    66% { border-radius: 50% 50% 40% 60% / 40% 70% 50% 50%; }
}
@keyframes fxAng { to { --ang: 360deg; } }

/* حلقات رادار */
.fx-radar { position: absolute; z-index: 0; left: 50%; top: 50%; pointer-events: none; }
.fx-radar i {
    position: absolute; border-radius: 50%; border: 1px solid rgba(0,229,255,.25);
    transform: translate(-50%, -50%); animation: fxPing 6s ease-out infinite;
}
.fx-radar i:nth-child(1) { width: 520px; height: 520px; }
.fx-radar i:nth-child(2) { width: 520px; height: 520px; animation-delay: -2s; }
.fx-radar i:nth-child(3) { width: 520px; height: 520px; animation-delay: -4s; }
@keyframes fxPing { 0% { transform: translate(-50%,-50%) scale(.6); opacity: .9; } 100% { transform: translate(-50%,-50%) scale(2.3); opacity: 0; } }

/* ===== أشكال عائمة ===== */
.fx-shape {
    position: absolute; z-index: 1; pointer-events: none;
    transform: translate(calc(var(--mx) * var(--d) * 1px), calc(var(--my) * var(--d) * 1px));
    transition: transform .25s ease-out;
}
.fx-shape > b {
    display: block; width: var(--s); height: var(--s);
    animation: fxFloat var(--t) ease-in-out infinite alternate; animation-delay: var(--dl);
}
@keyframes fxFloat {
    from { transform: translateY(-16px) rotate(0deg); }
    to   { transform: translateY(18px) rotate(var(--r, 90deg)); }
}
.fx-shape.tri > b { background: linear-gradient(140deg, var(--cyan), var(--violet)); clip-path: polygon(50% 0, 100% 100%, 0 100%); opacity: .8; }
.fx-shape.ring > b { border: 3px solid var(--lime); border-radius: 50%; opacity: .75; box-shadow: 0 0 22px rgba(198,255,61,.5), inset 0 0 22px rgba(198,255,61,.3); }
.fx-shape.dia > b { background: linear-gradient(140deg, var(--pink), var(--violet)); clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); opacity: .8; }
.fx-shape.cross > b { background: var(--cyan); clip-path: polygon(35% 0, 65% 0, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0 65%, 0 35%, 35% 35%); opacity: .7; filter: drop-shadow(0 0 10px var(--cyan)); }
.fx-shape.pent > b { background: linear-gradient(140deg, var(--lime), var(--cyan)); clip-path: polygon(50% 0, 100% 38%, 82% 100%, 18% 100%, 0 38%); opacity: .55; }
.fx-shape.half > b { background: linear-gradient(90deg, var(--pink), transparent); border-radius: 999px 999px 0 0; height: calc(var(--s) / 2); opacity: .75; }
.fx-shape.dot > b { background: var(--pink); border-radius: 50%; box-shadow: 0 0 24px var(--pink); opacity: .9; }
.fx-shape.sq > b { border: 2px solid var(--violet); border-radius: 22%; box-shadow: 0 0 22px rgba(124,92,255,.6); opacity: .85; }

/* ===== الشريط العلوي ===== */
.fx-bar {
    position: absolute; z-index: 5; top: 24px; left: 28px; right: 28px;
    display: flex; justify-content: space-between; align-items: center; gap: 12px;
}
.fx-brand {
    display: flex; align-items: center; gap: 12px; padding: 8px 18px 8px 8px;
    background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
    border-radius: 999px; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
}
.fx-logo {
    width: 42px; height: 42px; display: grid; place-items: center; color: #03030b;
    background: linear-gradient(135deg, var(--cyan), var(--lime));
    border-radius: 14px 4px 14px 4px; animation: fxLogo 6s ease-in-out infinite;
}
@keyframes fxLogo { 50% { border-radius: 4px 14px 4px 14px; transform: rotate(8deg); } }
.fx-brand b { font-size: 14.5px; font-weight: 800; display: block; line-height: 1.2; }
.fx-brand small { font-family: 'Space Grotesk', sans-serif; font-size: 10.5px; color: var(--cyan); letter-spacing: 2px; direction: ltr; display: block; }
.fx-status {
    font-family: 'Space Grotesk', sans-serif; font-size: 11px; letter-spacing: 1.5px; color: var(--dim); direction: ltr;
    display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px;
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); border-radius: 999px;
}
.fx-status i { width: 7px; height: 7px; border-radius: 50%; background: var(--lime); box-shadow: 0 0 12px var(--lime); animation: fxBlink 1.8s infinite; }
@keyframes fxBlink { 50% { opacity: .2; } }

/* ===== البطاقة ===== */
.fx-card {
    --r: 46px 10px 46px 10px;
    position: relative; z-index: 4; width: 100%; max-width: 450px;
    padding: 62px 32px 26px; border-radius: var(--r);
    background: linear-gradient(160deg, rgba(20,22,52,.72), rgba(7,8,22,.82));
    backdrop-filter: blur(26px) saturate(150%); -webkit-backdrop-filter: blur(26px) saturate(150%);
    box-shadow: 0 40px 90px -20px rgba(0,229,255,.28), 0 0 0 1px rgba(255,255,255,.04) inset;
    transform: perspective(1200px) rotateY(calc(var(--mx) * 4deg)) rotateX(calc(var(--my) * -4deg));
    transition: transform .25s ease-out;
    animation: fxCardIn 1s cubic-bezier(.2,.9,.2,1) both;
}
@keyframes fxCardIn { from { opacity: 0; transform: perspective(1200px) translateY(50px) rotateX(18deg); } }
.fx-card::before {
    content: ''; position: absolute; inset: 0; border-radius: var(--r); padding: 1.5px; pointer-events: none;
    background: conic-gradient(from var(--ang), transparent 0 55%, var(--cyan), var(--lime), var(--pink), transparent 95%);
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude;
    animation: fxAng 5s linear infinite;
}

/* شعار متحول في أعلى البطاقة */
.fx-emb {
    position: absolute; top: -44px; left: 50%; margin-left: -44px; width: 88px; height: 88px;
    display: grid; place-items: center;
}
.fx-emb::before {
    content: ''; position: absolute; inset: 0; border-radius: 50%;
    background: conic-gradient(from var(--ang), var(--cyan), var(--violet), var(--pink), var(--lime), var(--cyan));
    animation: fxAng 4s linear infinite; filter: drop-shadow(0 0 18px rgba(0,229,255,.7));
}
.fx-emb::after { content: ''; position: absolute; inset: 4px; border-radius: 50%; background: #070818; }
.fx-emb .core {
    position: absolute; inset: 14px; z-index: 1; display: grid; place-items: center; color: #03030b;
    background: linear-gradient(135deg, var(--cyan), var(--lime));
    animation: fxMorph 7s ease-in-out infinite;
}
.fx-emb .core svg { position: relative; }
.fx-emb.busy::before { animation-duration: .8s; }
.fx-emb.busy .core { animation-duration: 1.4s; }
.fx-emb.bad::before { background: conic-gradient(from var(--ang), var(--pink), #ff2a55, var(--pink)); filter: drop-shadow(0 0 20px rgba(255,42,85,.8)); }
.fx-emb.bad .core { background: linear-gradient(135deg, #ff2a55, var(--pink)); animation: fxShake .5s; }

/* التبويب */
.fx-tabs {
    position: relative; display: grid; grid-template-columns: 1fr 1fr; padding: 4px; margin-bottom: 26px;
    background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); border-radius: 18px 6px 18px 6px;
}
.fx-tabs::before {
    content: ''; position: absolute; top: 4px; bottom: 4px; right: 4px; width: calc(50% - 4px);
    background: linear-gradient(100deg, var(--cyan), var(--violet)); border-radius: 14px 4px 14px 4px;
    box-shadow: 0 0 26px rgba(0,229,255,.45);
}
.fx-tab { position: relative; z-index: 1; text-align: center; padding: 10px; font-size: 14px; font-weight: 800; color: var(--dim); text-decoration: none; transition: color .2s; }
.fx-tab.on { color: #03030b; }
.fx-tab:not(.on):hover { color: #fff; }

.fx-card h2 { margin: 0 0 6px; font-size: 28px; font-weight: 900; text-align: center; }
.fx-card h2 span {
    background: linear-gradient(90deg, var(--cyan), var(--lime), var(--pink), var(--cyan)); background-size: 250% 100%;
    -webkit-background-clip: text; background-clip: text; color: transparent; animation: fxText 5s linear infinite;
}
@keyframes fxText { to { background-position: -250% 0; } }
.fx-sub { margin: 0 0 24px; text-align: center; color: var(--dim); font-size: 13.5px; line-height: 1.8; }

.fx-err {
    display: flex; gap: 10px; align-items: center; margin-bottom: 16px; padding: 11px 14px; border-radius: 14px 4px 14px 4px;
    background: rgba(255,42,85,.1); border: 1px solid rgba(255,42,85,.5); color: #ff95aa; font-size: 13.5px; font-weight: 700;
    animation: fxShake .45s;
}
@keyframes fxShake { 25%,75% { transform: translateX(-7px); } 50% { transform: translateX(7px); } }

/* الحقول */
.fx-fld { position: relative; margin-bottom: 14px; border-radius: 18px 5px 18px 5px; overflow: hidden; }
.fx-fld::before {
    content: ''; position: absolute; inset: 0; padding: 1.5px; border-radius: inherit; pointer-events: none; z-index: 2;
    background: rgba(255,255,255,.14); transition: background .3s;
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude;
}
.fx-fld:focus-within::before { background: linear-gradient(100deg, var(--cyan), var(--lime)); }
.fx-fld::after {
    content: ''; position: absolute; left: 0; right: 0; height: 2px; top: 0; z-index: 2; opacity: 0; pointer-events: none;
    background: linear-gradient(90deg, transparent, var(--cyan), transparent); box-shadow: 0 0 14px var(--cyan);
}
.fx-fld:focus-within::after { opacity: 1; animation: fxScan 1.8s ease-in-out infinite alternate; }
@keyframes fxScan { from { top: 0; } to { top: calc(100% - 2px); } }
.fx-fld .in {
    width: 100%; height: 64px; padding: 20px 56px 0 52px; background: rgba(8,10,28,.85); border: 0; outline: 0; color: #fff;
    font-size: 15.5px; font-family: 'Space Grotesk', 'Cairo', sans-serif; direction: ltr; text-align: right;
}
.fx-fld label {
    position: absolute; right: 56px; top: 21px; z-index: 3; font-size: 14px; font-weight: 700; color: var(--dim);
    pointer-events: none; transition: all .22s ease; transform-origin: right;
}
.fx-fld .in:focus ~ label, .fx-fld .in:not(:placeholder-shown) ~ label { top: 9px; font-size: 11px; color: var(--cyan); }
.fx-ic { position: absolute; right: 18px; top: 20px; z-index: 3; color: #6c72a6; transition: color .3s; display: grid; }
.fx-fld:focus-within .fx-ic { color: var(--lime); }
.fx-eye { position: absolute; left: 12px; top: 18px; z-index: 3; background: transparent; border: 0; color: #6c72a6; cursor: pointer; padding: 4px; display: grid; transition: color .2s; }
.fx-eye:hover { color: #fff; }

.fx-row { display: flex; justify-content: space-between; align-items: center; margin: 6px 0 22px; font-size: 13px; }
.fx-chk { display: inline-flex; align-items: center; gap: 9px; color: var(--dim); font-weight: 600; cursor: pointer; user-select: none; }
.fx-chk input { position: absolute; opacity: 0; pointer-events: none; }
.fx-chk .sw { width: 38px; height: 22px; border-radius: 99px; background: rgba(255,255,255,.1); position: relative; transition: background .25s; }
.fx-chk .sw::after { content: ''; position: absolute; top: 3px; right: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .25s; }
.fx-chk input:checked + .sw { background: linear-gradient(90deg, var(--cyan), var(--lime)); }
.fx-chk input:checked + .sw::after { transform: translateX(-16px); background: #03030b; }
.fx-chk input:focus-visible + .sw { outline: 2px solid var(--cyan); outline-offset: 2px; }
.fx-forgot { color: var(--cyan); font-weight: 700; text-decoration: none; transition: color .2s; }
.fx-forgot:hover { color: var(--lime); }

/* الزر */
.fx-go {
    position: relative; width: 100%; height: 60px; border: 0; cursor: pointer; overflow: hidden; color: #03030b;
    font-family: inherit; font-size: 16.5px; font-weight: 900; border-radius: 20px 6px 20px 6px;
    background: linear-gradient(100deg, var(--cyan), var(--lime), var(--cyan)); background-size: 220% 100%;
    animation: fxGrad 4s linear infinite; display: flex; align-items: center; justify-content: center; gap: 14px;
    transition: transform .25s, border-radius .4s, box-shadow .25s; box-shadow: 0 14px 34px -8px rgba(0,229,255,.55);
}
@keyframes fxGrad { to { background-position: -220% 0; } }
.fx-go:hover:not(:disabled) { transform: translateY(-3px); border-radius: 6px 20px 6px 20px; box-shadow: 0 20px 44px -8px rgba(198,255,61,.55); }
.fx-go:active:not(:disabled) { transform: translateY(0) scale(.99); }
.fx-go:disabled { cursor: not-allowed; filter: saturate(.7); }
.fx-go:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
.fx-go .arr { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; background: #03030b; color: var(--cyan); transition: transform .3s; }
.fx-go:hover:not(:disabled) .arr { transform: translateX(-6px) rotate(-45deg); }
.fx-spin { width: 20px; height: 20px; border-radius: 50%; border: 3px solid rgba(3,3,11,.25); border-top-color: #03030b; animation: fxRot .7s linear infinite; }
@keyframes fxRot { to { transform: rotate(360deg); } }

.fx-foot {
    margin-top: 22px; padding-top: 16px; border-top: 1px dashed rgba(255,255,255,.12); direction: ltr;
    display: flex; justify-content: space-between; font-family: 'Space Grotesk', sans-serif; font-size: 10.5px; letter-spacing: 1.2px; color: #5e6492;
}
.fx-foot span { display: inline-flex; align-items: center; gap: 6px; }
.fx-foot i { width: 6px; height: 6px; border-radius: 50%; background: var(--lime); box-shadow: 0 0 8px var(--lime); }

/* شرائح الميزات */
.fx-chips { position: absolute; z-index: 5; bottom: 26px; left: 0; right: 0; display: flex; justify-content: center; gap: 14px; padding: 0 16px; flex-wrap: wrap; }
.fx-chip {
    display: inline-flex; align-items: center; gap: 10px; padding: 10px 20px 10px 14px; font-size: 13.5px; font-weight: 700;
    background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
    transition: transform .3s, background .3s;
}
.fx-chip:nth-child(1) { border-radius: 999px; }
.fx-chip:nth-child(2) { border-radius: 16px 4px 16px 4px; }
.fx-chip:nth-child(3) { border-radius: 4px 16px 4px 16px; }
.fx-chip:hover { transform: translateY(-5px); background: rgba(0,229,255,.12); }
.fx-chip em { font-style: normal; font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; color: #03030b; padding: 3px 8px; background: linear-gradient(90deg, var(--cyan), var(--lime)); border-radius: 99px; }

@media (max-width: 760px) {
    .fx { padding: 96px 14px 40px; }
    .fx-chips, .fx-status { display: none; }
    .fx-shape.hide-m { display: none; }
    .fx-bar { left: 14px; right: 14px; top: 16px; }
    .fx-card { padding: 60px 22px 22px; }
    .fx-blob { width: 420px; height: 420px; margin: -210px 0 0 -210px; }
}
@media (prefers-reduced-motion: reduce) {
    .fx *, .fx *::before, .fx *::after { animation-duration: .001s !important; animation-iteration-count: 1 !important; transition: none !important; }
}
`;

const SHAPES = [
    { k: 'tri',   top: '14%', left: '8%',  s: 74, d: 38, t: 7,  dl: 0,   r: '140deg' },
    { k: 'ring',  top: '22%', left: '82%', s: 96, d: 26, t: 9,  dl: -2,  r: '200deg' },
    { k: 'dia',   top: '68%', left: '10%', s: 62, d: 46, t: 8,  dl: -4,  r: '180deg' },
    { k: 'cross', top: '12%', left: '62%', s: 38, d: 54, t: 6,  dl: -1,  r: '120deg', m: 1 },
    { k: 'pent',  top: '72%', left: '84%', s: 84, d: 30, t: 10, dl: -5,  r: '160deg' },
    { k: 'half',  top: '46%', left: '3%',  s: 90, d: 22, t: 8,  dl: -3,  r: '40deg',  m: 1 },
    { k: 'dot',   top: '84%', left: '46%', s: 16, d: 60, t: 5,  dl: -2,  r: '0deg' },
    { k: 'sq',    top: '40%', left: '91%', s: 54, d: 40, t: 7,  dl: -6,  r: '220deg', m: 1 },
    { k: 'dot',   top: '9%',  left: '30%', s: 12, d: 64, t: 6,  dl: -1,  r: '0deg' },
    { k: 'ring',  top: '86%', left: '24%', s: 44, d: 36, t: 9,  dl: -4,  r: '260deg', m: 1 },
];

const IcMail = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="4" /><path d="m4 8 8 6 8-6" />
    </svg>
);
const IcLock = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10" width="16" height="11" rx="4" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 15v2" />
    </svg>
);
const IcEye = ({ off }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />
        {off && <path d="M4 4l16 16" />}
    </svg>
);
const IcFinger = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a7 7 0 0 0-7 7v2M12 7a3 3 0 0 0-3 3v4c0 2 .6 4 1.8 6M12 11v3c0 2.2.5 4 1.4 5.5M16 10a4 4 0 0 0-1.2-2.8M19 12v1c0 2.4-.4 4.4-1.2 6" />
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
    const rootRef = useRef(null);
    const shapes = useMemo(() => SHAPES, []);

    // تتبع الماوس: يحرك الأشكال والبطاقة والإضاءة بدون إعادة رسم
    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        const move = (e) => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            el.style.setProperty('--mx', ((x - 0.5) * 2).toFixed(3));
            el.style.setProperty('--my', ((y - 0.5) * 2).toFixed(3));
            el.style.setProperty('--px', `${(x * 100).toFixed(1)}%`);
            el.style.setProperty('--py', `${(y * 100).toFixed(1)}%`);
        };
        window.addEventListener('pointermove', move, { passive: true });
        return () => window.removeEventListener('pointermove', move);
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

    const embState = isLoading ? 'busy' : errorMsg ? 'bad' : '';

    return (
        <div className="fx" dir="rtl" ref={rootRef}>
            <style>{css}</style>

            {/* الخلفية */}
            <div className="fx-glow" aria-hidden="true" />
            <div className="fx-blob" aria-hidden="true" />
            <div className="fx-radar" aria-hidden="true"><i /><i /><i /></div>
            <div className="fx-floor" aria-hidden="true"><i /></div>

            {shapes.map((s, i) => (
                <div
                    key={i}
                    className={`fx-shape ${s.k}${s.m ? ' hide-m' : ''}`}
                    style={{ top: s.top, left: s.left, '--d': s.d, '--s': `${s.s}px`, '--t': `${s.t}s`, '--dl': `${s.dl}s`, '--r': s.r }}
                    aria-hidden="true"
                >
                    <b />
                </div>
            ))}

            {/* الشريط العلوي */}
            <header className="fx-bar">
                <div className="fx-brand">
                    <div className="fx-logo">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12" />
                        </svg>
                    </div>
                    <div>
                        <b>كلية هندسة الحاسوب</b>
                        <small>CE · NEXT PORTAL</small>
                    </div>
                </div>
                <div className="fx-status"><i />ALL SYSTEMS ONLINE</div>
            </header>

            {/* بطاقة الدخول */}
            <main className="fx-card">
                <div className={`fx-emb ${embState}`} aria-hidden="true">
                    <div className="core"><IcFinger /></div>
                </div>

                <div className="fx-tabs">
                    <span className="fx-tab on">تسجيل الدخول</span>
                    <Link to="/register" className="fx-tab">حساب جديد</Link>
                </div>

                <h2>مرحباً بك في <span>المستقبل</span></h2>
                <p className="fx-sub">أدخل بياناتك الجامعية لفتح بوابة المحاضرات والمساعد الذكي.</p>

                {errorMsg && (
                    <div className="fx-err" role="alert">
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4M12 17h.01" />
                        </svg>
                        <span>{errorMsg}</span>
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="fx-fld">
                        <span className="fx-ic"><IcMail /></span>
                        <input
                            id="fx-email"
                            className="in"
                            type="email"
                            required
                            autoComplete="username"
                            placeholder=" "
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                        <label htmlFor="fx-email">البريد الإلكتروني الجامعي</label>
                    </div>

                    <div className="fx-fld">
                        <span className="fx-ic"><IcLock /></span>
                        <input
                            id="fx-pass"
                            className="in"
                            type={showPass ? 'text' : 'password'}
                            required
                            autoComplete="current-password"
                            placeholder=" "
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                        <label htmlFor="fx-pass">كلمة المرور</label>
                        <button
                            type="button"
                            className="fx-eye"
                            tabIndex={-1}
                            onClick={() => setShowPass((s) => !s)}
                            aria-label={showPass ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                        >
                            <IcEye off={showPass} />
                        </button>
                    </div>

                    <div className="fx-row">
                        <label className="fx-chk">
                            <input type="checkbox" disabled={isLoading} />
                            <span className="sw" />
                            تذكرني
                        </label>
                        <Link to="/forgot-password" className="fx-forgot">نسيت كلمة المرور؟</Link>
                    </div>

                    <button type="submit" className="fx-go" disabled={isLoading}>
                        {isLoading ? (
                            <><span className="fx-spin" />جاري التحقق...</>
                        ) : (
                            <>
                                دخول إلى المنصة
                                <span className="arr">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
                                </span>
                            </>
                        )}
                    </button>
                </form>

                <div className="fx-foot">
                    <span><i />TLS ENCRYPTED</span>
                    <span>v3.0 · NEXT</span>
                </div>
            </main>

            {/* شرائح الميزات */}
            <div className="fx-chips" aria-hidden="true">
                <div className="fx-chip"><em>01</em>محاضرات مرتبة بالمراحل</div>
                <div className="fx-chip"><em>02</em>مساعد دراسة ذكي</div>
                <div className="fx-chip"><em>03</em>نقاش وتعليقات الطلبة</div>
            </div>
        </div>
    );
}
