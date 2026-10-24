import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function SmartDeadlines() {
    const { user } = useContext(AuthContext);
    const [deadlines, setDeadlines] = useState([]);
    
    // حالات الإضافة
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('امتحان');
    const [section, setSection] = useState('الكل');
    const [dueDate, setDueDate] = useState('');
    const [showForm, setShowForm] = useState(false);

    // حالات تسليم الطالب
    const [submitModal, setSubmitModal] = useState({ show: false, deadlineId: null, link: '' });
    
    // حالات عرض تسليمات المدير
    const [submissionsModal, setSubmissionsModal] = useState({ show: false, title: '', data: [] });
    const [isLoadingSubs, setIsLoadingSubs] = useState(false);

    const API_URL = 'https://edu-platform-backend-alpha.vercel.app/api/users/deadlines';

    const fetchDeadlines = async () => {
        try {
            const token = user?.token || localStorage.getItem('token');
            const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) setDeadlines(res.data.deadlines);
        } catch (err) {
            console.error('Error loading deadlines:', err);
        }
    };

    useEffect(() => {
        fetchDeadlines();
    }, []);

    const handleAddDeadline = async (e) => {
        e.preventDefault();
        try {
            const token = user?.token || localStorage.getItem('token');
            const res = await axios.post(API_URL, 
                { title, subject, category, section, due_date: dueDate },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setDeadlines([...deadlines, res.data.deadline].sort((a, b) => new Date(a.due_date) - new Date(b.due_date)));
                setTitle(''); setSubject(''); setDueDate(''); setShowForm(false);
            }
        } catch (err) {
            alert('حدث خطأ أثناء إضافة الموعد');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الموعد نهائياً؟')) return;
        try {
            const token = user?.token || localStorage.getItem('token');
            await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setDeadlines(deadlines.filter(d => d.id !== id));
        } catch (err) {
            alert('فشل الحذف');
        }
    };

    // دالة تسليم الرابط للطالب
    const handleStudentSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = user?.token || localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/${submitModal.deadlineId}/submit`, 
                { file_url: submitModal.link },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                alert('تم التسليم بنجاح! ✅');
                setSubmitModal({ show: false, deadlineId: null, link: '' });
            }
        } catch (err) {
            alert(err.response?.data?.message || 'حدث خطأ أثناء التسليم');
        }
    };

    // دالة جلب تسليمات الطلاب للمدير
    const fetchSubmissionsForAdmin = async (deadlineId, deadlineTitle) => {
        setIsLoadingSubs(true);
        setSubmissionsModal({ show: true, title: deadlineTitle, data: [] });
        try {
            const token = user?.token || localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/${deadlineId}/submissions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setSubmissionsModal({ show: true, title: deadlineTitle, data: res.data.submissions });
            }
        } catch (err) {
            alert('حدث خطأ في جلب التسليمات');
            setSubmissionsModal({ show: false, title: '', data: [] });
        } finally {
            setIsLoadingSubs(false);
        }
    };

    const getRemainingTime = (targetDate) => {
        const diff = new Date(targetDate) - new Date();
        const isExpired = diff <= 0;
        
        if (isExpired) return { text: 'انتهى الوقت 🛑', bg: '#f1f5f9', border: '#cbd5e1', color: '#64748b', isExpired };

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

        if (days < 2) return { text: `عاجل: متبقي ${days > 0 ? `${days} يوم و ` : ''}${hours} ساعة 🔥`, bg: '#fef2f2', border: '#fecaca', color: '#dc2626', isExpired };
        if (days <= 5) return { text: `متبقي ${days} أيام و ${hours} ساعة ⏳`, bg: '#fffbeb', border: '#fde68a', color: '#d97706', isExpired };
        
        return { text: `متبقي ${days} يوم 📅`, bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', isExpired };
    };

    return (
        <div style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px', fontFamily: 'system-ui' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ margin: 0, color: '#0B2447', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ⏰ تقويم الامتحانات والمهام
                </h3>
                {user?.isAdmin && (
                    <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', background: '#0B2447', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {showForm ? 'إلغاء ✖' : '+ إضافة موعد جديد'}
                    </button>
                )}
            </div>

            {/* نموذج الإضافة للمشرفين */}
            {showForm && user?.isAdmin && (
                <form onSubmit={handleAddDeadline} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input type="text" placeholder="العنوان (مثال: تقرير مختبر 1)" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ flex: '1 1 180px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    <input type="text" placeholder="اسم المادة (مثال: شبكات)" value={subject} onChange={(e) => setSubject(e.target.value)} required style={{ flex: '1 1 180px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                        <option value="امتحان">📝 امتحان</option>
                        <option value="كويز">⚡ كويز سريع</option>
                        <option value="تقرير مختبر">🔬 تقرير مختبر</option>
                        <option value="واجب">💻 واجب برمجي</option>
                    </select>
                    <select value={section} onChange={(e) => setSection(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                        <option value="الكل">جميع الشعب</option>
                        <option value="GA">شعبة GA</option>
                        <option value="GB">شعبة GB</option>
                    </select>
                    <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    <button type="submit" style={{ padding: '10px 20px', background: '#00adb5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>حفظ الموعد</button>
                </form>
            )}

            {/* عرض البطاقات */}
            {deadlines.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', margin: '15px 0' }}>🎉 لا توجد امتحانات أو مهام قريبة حالياً.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '15px' }}>
                    {deadlines.map((item) => {
                        const status = getRemainingTime(item.due_date);
                        const isTask = item.category === 'تقرير مختبر' || item.category === 'واجب';

                        return (
                            <div key={item.id} style={{ background: status.bg, border: `1px solid ${status.border}`, padding: '16px', borderRadius: '14px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                                {user?.isAdmin && (
                                    <button onClick={() => handleDelete(item.id)} style={{ position: 'absolute', top: '10px', left: '10px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px' }} title="حذف الموعد">🗑️</button>
                                )}
                                
                                <span style={{ fontSize: '12px', fontWeight: 'bold', background: 'white', padding: '4px 10px', borderRadius: '20px', color: '#0B2447', display: 'inline-block', marginBottom: '8px', alignSelf: 'flex-start' }}>
                                    {item.category} | شعبة: {item.section}
                                </span>
                                
                                <h4 style={{ margin: '5px 0', color: '#0B2447', fontSize: '17px' }}>{item.title}</h4>
                                <p style={{ margin: '0 0 10px 0', color: '#475569', fontSize: '14px' }}>📘 المادة: <strong>{item.subject}</strong></p>
                                
                                <div style={{ fontSize: '13px', fontWeight: 'bold', color: status.color, marginBottom: '15px' }}>
                                    {status.text}
                                </div>

                                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                                    {/* زر تسليم الطالب */}
                                    {!user?.isAdmin && isTask && !status.isExpired && (
                                        <button 
                                            onClick={() => setSubmitModal({ show: true, deadlineId: item.id, link: '' })}
                                            style={{ flex: 1, padding: '8px', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            📤 تسليم الواجب
                                        </button>
                                    )}
                                    
                                    {/* زر عرض التسليمات للمدير */}
                                    {user?.isAdmin && isTask && (
                                        <button 
                                            onClick={() => fetchSubmissionsForAdmin(item.id, item.title)}
                                            style={{ flex: 1, padding: '8px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            📥 عرض التسليمات
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* نافذة تسليم الطالب (Modal) */}
            {submitModal.show && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
                    <form onSubmit={handleStudentSubmit} style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ margin: '0 0 15px 0', color: '#0B2447' }}>🔗 تسليم الواجب</h3>
                        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>قم برفع ملفك على (Google Drive, GitHub, OneDrive) وضع الرابط هنا. تأكد من أن الرابط "متاح للجميع".</p>
                        
                        <input 
                            type="url" required placeholder="https://drive.google.com/..." 
                            value={submitModal.link} onChange={(e) => setSubmitModal({ ...submitModal, link: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '20px', direction: 'ltr' }}
                        />
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" style={{ flex: 1, padding: '10px', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>تسليم</button>
                            <button type="button" onClick={() => setSubmitModal({ show: false, deadlineId: null, link: '' })} style={{ flex: 1, padding: '10px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>إلغاء</button>
                        </div>
                    </form>
                </div>
            )}

            {/* نافذة عرض تسليمات المدير (Modal) */}
            {submissionsModal.show && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '800px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                            <h3 style={{ margin: 0, color: '#0B2447' }}>📥 تسليمات: {submissionsModal.title}</h3>
                            <button onClick={() => setSubmissionsModal({ show: false, title: '', data: [] })} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#dc2626' }}>✖</button>
                        </div>
                        
                        {isLoadingSubs ? (
                            <div style={{ textAlign: 'center', padding: '30px', color: '#00adb5', fontWeight: 'bold' }}>جاري التحميل...</div>
                        ) : submissionsModal.data.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>لم يقم أي طالب بالتسليم حتى الآن.</div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', color: '#0B2447' }}>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>الطالب</th>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>الشعبة</th>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>تاريخ التسليم</th>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>الملف</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissionsModal.data.map((sub, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{sub.full_name}</td>
                                            <td style={{ padding: '12px' }}>{sub.study_type || '-'} | {sub.section || '-'}</td>
                                            <td style={{ padding: '12px', fontSize: '13px', color: '#64748b', direction: 'ltr', textAlign: 'right' }}>
                                                {new Date(sub.submitted_at).toLocaleString('ar-IQ')}
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <a href={sub.file_url} target="_blank" rel="noopener noreferrer" style={{ background: '#0284c7', color: 'white', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                                                    فتح الرابط ↗
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}