import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Announcements() {
    const { user } = useContext(AuthContext);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState({ loading: false, message: '', type: '' });

    // قراءة الصلاحية بشكل نظيف من المستخدم المسجل
    const isAdmin = user?.isAdmin || (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).isAdmin);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://edu-platform-backend-alpha.vercel.app/api/announcements');
            if (response.data.success) {
                setAnnouncements(response.data.announcements);
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim() || !content.trim()) {
            setStatus({ loading: false, message: 'يرجى إدخال العنوان والمحتوى.', type: 'error' });
            return;
        }

        setStatus({ loading: true, message: 'جاري نشر التبليغ...', type: 'info' });

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'https://edu-platform-backend-alpha.vercel.app/api/announcements',
                { title, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setStatus({ loading: false, message: 'تم نشر التبليغ بنجاح! 🚀', type: 'success' });
                setTitle('');
                setContent('');
                fetchAnnouncements();
                
                setTimeout(() => setStatus({ loading: false, message: '', type: '' }), 3000);
            }
        } catch (error) {
            console.error(error);
            setStatus({ loading: false, message: 'حدث خطأ أثناء النشر.', type: 'error' });
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`هل أنت متأكد من حذف التبليغ "${title}"؟`)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://edu-platform-backend-alpha.vercel.app/api/announcements/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnnouncements((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Error deleting announcement:', error);
            alert('حدث خطأ أثناء الحذف.');
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', minHeight: '85vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ color: '#0B2447', fontSize: '32px', fontWeight: '900', margin: '0 0 10px 0' }}>
                    📢 لوحة التبليغات
                </h2>
                <p style={{ color: '#666', fontSize: '16px' }}>آخر الأخبار والتحديثات الرسمية للمرحلة الثانية</p>
            </div>

            {isAdmin && (
                <div style={{
                    background: 'white', borderRadius: '20px', padding: '30px', marginBottom: '40px',
                    boxShadow: '0 10px 30px rgba(0, 173, 181, 0.1)', border: '2px dashed #00adb5'
                }}>
                    <h3 style={{ color: '#00adb5', marginTop: 0, marginBottom: '20px' }}>✍️ كتابة تبليغ جديد</h3>
                    
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input 
                            type="text" 
                            placeholder="عنوان التبليغ (مثال: هام بخصوص امتحان الشبكات)" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                padding: '15px', borderRadius: '12px', border: '1px solid #ddd',
                                outline: 'none', fontSize: '16px', background: '#fcfdfe'
                            }}
                            required
                        />
                        <textarea 
                            placeholder="محتوى وتفاصيل التبليغ..." 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="4"
                            style={{
                                padding: '15px', borderRadius: '12px', border: '1px solid #ddd',
                                outline: 'none', fontSize: '16px', background: '#fcfdfe', resize: 'vertical'
                            }}
                            required
                        />

                        {status.message && (
                            <div style={{
                                padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold',
                                background: status.type === 'error' ? '#ffebee' : status.type === 'success' ? '#e8f5e9' : '#e3f2fd',
                                color: status.type === 'error' ? '#c62828' : status.type === 'success' ? '#2e7d32' : '#1565c0'
                            }}>
                                {status.message}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={status.loading}
                            style={{
                                background: '#0B2447', color: 'white', border: 'none', padding: '15px',
                                borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
                                transition: '0.3s', opacity: status.loading ? 0.7 : 1
                            }}
                        >
                            {status.loading ? 'جاري النشر...' : 'نشر التبليغ وإرسال إشعار'}
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', color: '#00adb5', fontWeight: 'bold', fontSize: '18px' }}>
                    جاري تحميل التبليغات... ⏳
                </div>
            ) : announcements.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '20px', color: '#888' }}>
                    لا توجد تبليغات منشورة حالياً.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {announcements.map((item) => (
                        <div key={item.id} style={{
                            background: 'white', borderRadius: '16px', padding: '25px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.05)', borderRight: '5px solid #0B2447',
                            position: 'relative'
                        }}>
                            {isAdmin && (
                                <button 
                                    onClick={() => handleDelete(item.id, item.title)}
                                    title="حذف التبليغ"
                                    style={{
                                        position: 'absolute', top: '20px', left: '20px', background: '#ffebee',
                                        color: '#c62828', border: 'none', padding: '8px 12px', borderRadius: '8px',
                                        cursor: 'pointer', fontWeight: 'bold', fontSize: '12px'
                                    }}
                                >
                                    🗑️ حذف
                                </button>
                            )}
                            
                            <h3 style={{ color: '#0B2447', margin: '0 0 10px 0', fontSize: '20px' }}>{item.title}</h3>
                            <span style={{ fontSize: '12px', color: '#888', background: '#f4f7f6', padding: '4px 10px', borderRadius: '20px' }}>
                                🕒 {new Date(item.created_at).toLocaleDateString('ar-IQ', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                            <p style={{ color: '#555', marginTop: '15px', lineHeight: '1.8', fontSize: '15px', whiteSpace: 'pre-wrap' }}>
                                {item.content}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}