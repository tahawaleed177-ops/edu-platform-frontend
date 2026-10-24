import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import MaterialCard from '../components/MaterialCard';
import { AuthContext } from '../context/AuthContext';
import SmartDeadlines from '../components/SmartDeadlines';

export default function Dashboard() {
    const { user } = useContext(AuthContext);

    const [activeSemester, setActiveSemester] = useState('semester1');
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);

    // حالات الترحيب والمستخدم
    const [showWelcome, setShowWelcome] = useState(true);
    const [userName, setUserName] = useState('طالب');
    const [isAdmin, setIsAdmin] = useState(false);

    // === الحالات الجديدة: البحث ومعاينة الـ PDF والتقدم ===
    const [searchQuery, setSearchQuery] = useState('');
    const [previewMaterial, setPreviewMaterial] = useState(null);
    const [completedIds, setCompletedIds] = useState([]); // مصفوفة لحفظ أرقام المحاضرات المكتملة

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        const storedUser = localStorage.getItem('user');

        if (user?.name) {
            setUserName(user.name.split(' ')[0]);
        } else if (storedName && storedName !== 'null' && storedName !== 'undefined') {
            setUserName(storedName.split(' ')[0]);
        }

        if (user?.isAdmin) {
            setIsAdmin(true);
        } else if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed.isAdmin) setIsAdmin(true);
            } catch (e) {}
        }

        const timer = setTimeout(() => {
            setShowWelcome(false);
        }, 2500);

        // جلب المحاضرات المكتملة فور تحميل الصفحة
        fetchProgress();

        return () => clearTimeout(timer);
    }, [user]);

    // دالة جلب تقدم الطالب من الباك إند
    const fetchProgress = async () => {
        try {
            const token = user?.token || localStorage.getItem('token');
            if (!token) return;
            const response = await axios.get('https://edu-platform-backend-alpha.vercel.app/api/progress', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                setCompletedIds(response.data.completed);
            }
        } catch (error) {
            console.error("خطأ في جلب بيانات التقدم:", error);
        }
    };

    const subjects = {
        semester1: [
            { id: 1, name: 'أساسيات شبكات الحاسوب', enName: 'Computer Networks Fundamentals', icon: '🌐' },
            { id: 2, name: 'إلكترونيات رقمية', enName: 'Digital Electronics', icon: '⚡' },
            { id: 3, name: 'برمجة كينونية', enName: 'Object Oriented Programming', icon: '💻' },
            { id: 4, name: 'أنظمة تشغيل', enName: 'Operating Systems', icon: '🖥️' },
            { id: 5, name: 'رياضيات 3', enName: 'Math III', icon: '📐' },
            { id: 6, name: 'لغة عربية 1', enName: 'Arabic I', icon: '📖' },
            { id: 7, name: 'جرائم حزب البعث', enName: 'Crimes of Baath Regime', icon: '📜' },
        ],
        semester2: [
            { id: 8, name: 'شبكات حاسوب متقدمة', enName: 'Advanced Computer Networks', icon: '📡' },
            { id: 9, name: 'معمارية الحاسوب', enName: 'Computer Architecture', icon: '🏗️' },
            { id: 10, name: 'هياكل البيانات', enName: 'Data Structures & Algorithms', icon: '🗂️' },
            { id: 11, name: 'أنظمة قواعد البيانات', enName: 'Database Systems', icon: '🗄️' },
            { id: 12, name: 'رياضيات 4', enName: 'Math IV', icon: '📏' },
            { id: 13, name: 'لغة إنكليزية', enName: 'English language', icon: '📝' },
        ]
    };

    const fetchMaterials = (subjectId) => {
        setLoading(true);
        axios.get(`https://edu-platform-backend-alpha.vercel.app/api/materials/subject/${subjectId}`)
            .then(response => {
                if (response.data.success) {
                    setMaterials(response.data.materials);
                } else {
                    setMaterials([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("حدث خطأ في جلب المحاضرات:", error);
                setMaterials([]);
                setLoading(false);
            });
    };

    const handleDeleteMaterial = async (materialId, materialTitle) => {
        if (!window.confirm(`هل أنت متأكد من حذف محاضرة "${materialTitle}" نهائياً؟`)) {
            return;
        }

        try {
            const token = user?.token || localStorage.getItem('token');
            const response = await axios.delete(`https://edu-platform-backend-alpha.vercel.app/api/materials/${materialId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setMaterials(prev => prev.filter(mat => mat.id !== materialId));
            }
        } catch (error) {
            console.error("خطأ أثناء الحذف:", error);
            alert(error.response?.data?.message || "حدث خطأ أثناء حذف المحاضرة.");
        }
    };

    const handleSubjectClick = (subject) => {
        setSelectedSubject(subject);
        setSearchQuery(''); 
        fetchMaterials(subject.id);
    };

    const handleBack = () => {
        setSelectedSubject(null);
        setSearchQuery(''); 
        setMaterials([]);
    };

    const filteredSubjects = subjects[activeSemester].filter((subject) =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.enName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredMaterials = materials.filter((mat) =>
        (mat.title && mat.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (mat.description && mat.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // حساب نسبة الإنجاز للمادة المحددة
    const subjectCompletedCount = materials.filter(m => completedIds.includes(m.id)).length;
    const progressPercentage = materials.length > 0 ? Math.round((subjectCompletedCount / materials.length) * 100) : 0;

    if (showWelcome) {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: '#0B2447', display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center', zIndex: 9999,
                animation: 'fadeOut 0.8s ease-in-out 1.8s forwards'
            }}>
                <style>
                    {`
                    @keyframes fadeOut { to { opacity: 0; visibility: hidden; } }
                    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                    `}
                </style>
                <div style={{ fontSize: '70px', marginBottom: '20px', animation: 'slideUp 0.8s ease-out' }}>🎓</div>
                <h1 style={{ color: 'white', fontSize: '42px', fontWeight: 'bold', margin: '0 0 10px 0', animation: 'slideUp 0.8s ease-out 0.2s both' }}>
                    أهلاً بك، {userName}
                </h1>
                <p style={{ color: '#00adb5', fontSize: '20px', fontWeight: 'bold', margin: 0, animation: 'slideUp 0.8s ease-out 0.4s both' }}>
                    {isAdmin ? 'مدير منصة هندسة الحاسوب' : 'منصة هندسة الحاسوب'}
                </p>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', minHeight: '85vh' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#0B2447', fontSize: '32px', fontWeight: '900', marginBottom: '10px' }}>
                    المقررات الدراسية - المرحلة الثانية
                </h2>
                <p style={{ color: '#666', fontSize: '16px' }}>قسم هندسة الحاسوب | الجامعة التكنولوجية</p>
            </div>

            <div style={{ maxWidth: '600px', margin: '0 auto 35px auto', position: 'relative' }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                        !selectedSubject 
                            ? "🔍 ابحث عن اسم المادة (بالعربي أو الإنكليزي)..." 
                            : `🔍 ابحث داخل محاضرات ${selectedSubject.name}...`
                    }
                    style={{
                        width: '100%', padding: '15px 20px', paddingLeft: searchQuery ? '45px' : '20px',
                        borderRadius: '30px', border: '2px solid #e0e5ec', fontSize: '15px',
                        outline: 'none', background: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', transition: '0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#00adb5'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e5ec'}
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        title="مسح البحث"
                        style={{
                            position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)',
                            background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '50%',
                            width: '26px', height: '26px', cursor: 'pointer', fontWeight: 'bold',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>

            {!selectedSubject ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px' }}>
                        <button
                            onClick={() => setActiveSemester('semester1')}
                            style={{
                                padding: '12px 30px', borderRadius: '30px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', border: 'none', transition: '0.3s',
                                background: activeSemester === 'semester1' ? '#0B2447' : '#e0e5ec',
                                color: activeSemester === 'semester1' ? 'white' : '#555',
                                boxShadow: activeSemester === 'semester1' ? '0 4px 15px rgba(11, 36, 71, 0.2)' : 'none'
                            }}
                        >
                            كورس أول
                        </button>
                        <button
                            onClick={() => setActiveSemester('semester2')}
                            style={{
                                padding: '12px 30px', borderRadius: '30px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', border: 'none', transition: '0.3s',
                                background: activeSemester === 'semester2' ? '#00adb5' : '#e0e5ec',
                                color: activeSemester === 'semester2' ? 'white' : '#555',
                                boxShadow: activeSemester === 'semester2' ? '0 4px 15px rgba(0, 173, 181, 0.2)' : 'none'
                            }}
                        >
                            كورس ثاني
                        </button>
                    </div>

                    {filteredSubjects.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '20px', color: '#888' }}>
                            لا توجد مادة تطابق بحثك "{searchQuery}"
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                            {filteredSubjects.map((subject) => (
                                <div
                                    key={subject.id}
                                    onClick={() => handleSubjectClick(subject)}
                                    style={{
                                        background: 'white', borderRadius: '20px', padding: '25px', cursor: 'pointer',
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.04)', transition: '0.3s', border: '1px solid #f0f3f3',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <div style={{ fontSize: '40px', marginBottom: '15px' }}>{subject.icon}</div>
                                    <h3 style={{ color: '#0B2447', fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>
                                        {subject.name}
                                    </h3>
                                    <p style={{ color: '#888', fontSize: '13px', fontWeight: '600' }}>
                                        {subject.enName}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #f0f3f3', paddingBottom: '20px' }}>
                        <div>
                            <h3 style={{ color: '#0B2447', fontSize: '24px', fontWeight: 'bold' }}>
                                {selectedSubject.icon} {selectedSubject.name}
                            </h3>
                            <p style={{ color: '#888', marginTop: '5px' }}>{selectedSubject.enName}</p>
                        </div>
                        <button
                            onClick={handleBack}
                            style={{
                                background: '#f4f7f6', color: '#0B2447', border: 'none', padding: '10px 20px',
                                borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#e0e5ec'}
                            onMouseOut={(e) => e.target.style.background = '#f4f7f6'}
                        >
                            ← عودة للمواد
                        </button>
                    </div>

                    {/* === شريط التقدم التفاعلي للمادة === */}
                    {!loading && materials.length > 0 && (
                        <div style={{ marginBottom: '30px', background: '#f9fcfe', border: '1px solid #eef2f2', borderRadius: '16px', padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold', color: '#0B2447', fontSize: '16px' }}>🚀 تقدمك في المادة:</span>
                                <span style={{ fontWeight: 'bold', color: progressPercentage === 100 ? '#4CAF50' : '#00adb5', fontSize: '18px' }}>
                                    {progressPercentage}% ({subjectCompletedCount}/{materials.length})
                                </span>
                            </div>
                            <div style={{ width: '100%', height: '14px', background: '#e0e5ec', borderRadius: '20px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${progressPercentage}%`,
                                    height: '100%',
                                    background: progressPercentage === 100 ? '#4CAF50' : '#00adb5',
                                    borderRadius: '20px',
                                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}></div>
                            </div>
                            {progressPercentage === 100 && (
                                <p style={{ textAlign: 'center', color: '#4CAF50', fontWeight: 'bold', margin: '15px 0 0 0', fontSize: '15px' }}>
                                    🎉 بطل! لقد أتممت دراسة جميع المحاضرات المتاحة لهذه المادة.
                                </p>
                            )}
                        </div>
                    )}

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#00adb5', fontSize: '18px', fontWeight: 'bold' }}>
                            جاري تحميل المحاضرات... ⏳
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                            {filteredMaterials.length === 0 ? (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', background: '#f9f9f9', borderRadius: '16px' }}>
                                    <p style={{ color: '#888', fontSize: '16px' }}>
                                        {searchQuery 
                                            ? `لا توجد محاضرات تطابق بحثك "${searchQuery}"`
                                            : 'لا توجد محاضرات مرفوعة لهذه المادة حتى الآن.'}
                                    </p>
                                </div>
                            ) : (
                                filteredMaterials.map((mat) => (
                                    <MaterialCard
                                        key={mat.id}
                                        material={mat}
                                        isAdmin={isAdmin}
                                        onDelete={handleDeleteMaterial}
                                        onPreview={(fileData) => setPreviewMaterial(fileData)}
                                        /* إرسال حالة الإكمال للكارت */
                                        isCompleted={completedIds.includes(mat.id)}
                                        onToggleComplete={(id, status) => {
                                            if (status) {
                                                setCompletedIds(prev => [...prev, id]);
                                            } else {
                                                setCompletedIds(prev => prev.filter(i => i !== id));
                                            }
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

            {previewMaterial && (
                <div 
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        background: 'rgba(11, 36, 71, 0.85)', display: 'flex',
                        justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '20px'
                    }}
                    onClick={() => setPreviewMaterial(null)}
                >
                    <div 
                        style={{
                            background: 'white', width: '95%', maxWidth: '1000px', height: '90vh',
                            borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{
                            background: '#0B2447', color: 'white', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                📄 معاينة: {previewMaterial.title}
                            </h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <a
                                    href={previewMaterial.fullFileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        background: '#00adb5', color: 'white', textDecoration: 'none',
                                        padding: '8px 15px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold'
                                    }}
                                >
                                    فتح في نافذة كاملة ↗
                                </a>
                                <button
                                    onClick={() => setPreviewMaterial(null)}
                                    style={{
                                        background: '#e53935', color: 'white', border: 'none',
                                        padding: '8px 15px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer'
                                    }}
                                >
                                    ✕ إغلاق
                                </button>
                            </div>
                        </div>
                        <iframe
                            src={previewMaterial.fullFileUrl}
                            title={previewMaterial.title}
                            width="100%" height="100%"
                            style={{ border: 'none', flex: 1 }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}