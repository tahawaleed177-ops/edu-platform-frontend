import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function SmartDeadlines() {
    const { user } = useContext(AuthContext);
    const [deadlines, setDeadlines] = useState([]);
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('امتحان');
    const [section, setSection] = useState('الكل');
    const [dueDate, setDueDate] = useState('');
    const [showForm, setShowForm] = useState(false);

    const API_URL = 'https://edu-platform-backend-alpha.vercel.app/api/users/deadlines';

    const fetchDeadlines = async () => {
        try {
            const token = user?.token || localStorage.getItem('token');
            const res = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setDeadlines(res.data.deadlines);
            }
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
                setTitle('');
                setSubject('');
                setDueDate('');
                setShowForm(false);
            }
        } catch (err) {
            alert('حدث خطأ أثناء إضافة الموعد');
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = user?.token || localStorage.getItem('token');
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDeadlines(deadlines.filter(d => d.id !== id));
        } catch (err) {
            alert('فشل الحذف');
        }
    };

    // دالة حساب الوقت المتبقي وتحديد لون الخطورة
    const getRemainingTime = (targetDate) => {
        const diff = new Date(targetDate) - new Date();
        if (diff <= 0) return { text: 'حان الموعد / انتهى ⌛', bg: '#f1f5f9', border: '#cbd5e1', color: '#64748b' };

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

        if (days < 2) {
            return { text: `عاجل: متبقي ${days > 0 ? `${days} يوم و ` : ''}${hours} ساعة 🔥`, bg: '#fef2f2', border: '#fecaca', color: '#dc2626' };
        } else if (days <= 5) {
            return { text: `متبقي ${days} أيام و ${hours} ساعة ⏳`, bg: '#fffbeb', border: '#fde68a', color: '#d97706' };
        }
        return { text: `متبقي ${days} يوم 📅`, bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d' };
    };

    return (
        <div style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px', fontFamily: 'system-ui' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ margin: 0, color: '#0B2447', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ⏰ تقويم الامتحانات والمهام الذكي
                </h3>
                {user?.isAdmin && (
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        style={{ padding: '8px 16px', background: '#0B2447', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                    >
                        {showForm ? 'إلغاء ✖' : '+ إضافة موعد جديد'}
                    </button>
                )}
            </div>

            {/* نموذج الإضافة للمشرفين */}
            {showForm && user?.isAdmin && (
                <form onSubmit={handleAddDeadline} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input type="text" placeholder="العنوان (مثال: امتحان مد أول)" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ flex: '1 1 180px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    <input type="text" placeholder="اسم المادة (مثال: تصميم منطقي)" value={subject} onChange={(e) => setSubject(e.target.value)} required style={{ flex: '1 1 180px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
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
                <p style={{ color: '#64748b', textAlign: 'center', margin: '15px 0' }}>🎉 لا توجد امتحانات أو تسليمات قريبة حالياً.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '15px' }}>
                    {deadlines.map((item) => {
                        const status = getRemainingTime(item.due_date);
                        return (
                            <div key={item.id} style={{ background: status.bg, border: `1px solid ${status.border}`, padding: '16px', borderRadius: '14px', position: 'relative' }}>
                                {user?.isAdmin && (
                                    <button onClick={() => handleDelete(item.id)} style={{ position: 'absolute', top: '10px', left: '10px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px' }} title="حذف">🗑️</button>
                                )}
                                <span style={{ fontSize: '12px', fontWeight: 'bold', background: 'white', padding: '4px 10px', borderRadius: '20px', color: '#0B2447', display: 'inline-block', marginBottom: '8px' }}>
                                    {item.category} | شعبة: {item.section}
                                </span>
                                <h4 style={{ margin: '5px 0', color: '#0B2447', fontSize: '17px' }}>{item.title}</h4>
                                <p style={{ margin: '0 0 10px 0', color: '#475569', fontSize: '14px' }}>📘 المادة: <strong>{item.subject}</strong></p>
                                <div style={{ fontSize: '13px', fontWeight: 'bold', color: status.color }}>
                                    {status.text}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}