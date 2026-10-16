import React, { useState } from 'react';
import axios from 'axios';

export default function UploadMaterial() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subjectId, setSubjectId] = useState('1');
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState({ loading: false, message: '', type: '' });

    // قائمة المواد (للاختيار منها عند الرفع)
    const subjects = [
        { id: 1, name: 'أساسيات شبكات الحاسوب (كورس 1)' },
        { id: 2, name: 'إلكترونيات رقمية (كورس 1)' },
        { id: 3, name: 'برمجة كينونية (كورس 1)' },
        { id: 4, name: 'أنظمة تشغيل (كورس 1)' },
        { id: 5, name: 'رياضيات 3 (كورس 1)' },
        { id: 6, name: 'لغة عربية 1 (كورس 1)' },
        { id: 7, name: 'جرائم حزب البعث (كورس 1)' },
        { id: 8, name: 'شبكات حاسوب متقدمة (كورس 2)' },
        { id: 9, name: 'معمارية الحاسوب (كورس 2)' },
        { id: 10, name: 'هياكل البيانات (كورس 2)' },
        { id: 11, name: 'أنظمة قواعد البيانات (كورس 2)' },
        { id: 12, name: 'رياضيات 4 (كورس 2)' },
        { id: 13, name: 'لغة إنكليزية (كورس 2)' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file) {
            setStatus({ loading: false, message: 'يرجى اختيار ملف المحاضرة (PDF)', type: 'error' });
            return;
        }

        setStatus({ loading: true, message: 'جاري رفع المحاضرة...', type: 'info' });

        // تجهيز البيانات كـ FormData لأننا نرسل ملفاً
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('subject_id', subjectId);
        formData.append('file', file);

        try {
            // === التعديل هنا: جلب مفتاح الدخول (التوكن) من المتصفح ===
            const token = localStorage.getItem('token'); 

            const response = await axios.post('https://edu-platform-backend-alpha.vercel.app/api/materials/upload', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    // === التعديل هنا: إرفاق التوكن للحارس الأمني ===
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (response.data.success || response.status === 201 || response.status === 200) {
                setStatus({ loading: false, message: 'تم رفع المحاضرة بنجاح! 🎉', type: 'success' });
                // تفريغ الحقول بعد الرفع
                setTitle('');
                setDescription('');
                setFile(null);
            }
        } catch (error) {
            console.error(error);
            // تحسين رسالة الخطأ لتوضح إذا كان السبب هو الصلاحيات
            if (error.response && error.response.status === 403) {
                setStatus({ loading: false, message: 'عذراً، ليس لديك صلاحية مدير لرفع المحاضرات.', type: 'error' });
            } else if (error.response && error.response.status === 401) {
                setStatus({ loading: false, message: 'يرجى تسجيل الدخول أولاً.', type: 'error' });
            } else {
                setStatus({ loading: false, message: 'حدث خطأ أثناء الرفع. تأكد من تشغيل الخادم.', type: 'error' });
            }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', padding: '20px' }}>
            <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 10px 30px rgba(11, 36, 71, 0.08)',
                width: '100%',
                maxWidth: '600px',
                borderTop: '5px solid #00adb5'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ color: '#0B2447', fontSize: '26px', fontWeight: '800' }}>رفع محاضرة جديدة</h2>
                    <p style={{ color: '#888', marginTop: '5px' }}>بوابة الأساتذة لإضافة المقررات الدراسية</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* حقل اسم المحاضرة */}
                    <div>
                        <label style={{ display: 'block', color: '#0B2447', fontWeight: 'bold', marginBottom: '8px' }}>عنوان المحاضرة</label>
                        <input 
                            type="text" 
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="مثال: الفصل الأول - مقدمة في الشبكات"
                            style={{
                                width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #ddd', 
                                outline: 'none', background: '#fcfdfe', fontSize: '15px'
                            }}
                        />
                    </div>

                    {/* حقل اختيار المادة */}
                    <div>
                        <label style={{ display: 'block', color: '#0B2447', fontWeight: 'bold', marginBottom: '8px' }}>المادة الدراسية</label>
                        <select 
                            value={subjectId}
                            onChange={(e) => setSubjectId(e.target.value)}
                            style={{
                                width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #ddd', 
                                outline: 'none', background: '#fcfdfe', fontSize: '15px', cursor: 'pointer'
                            }}
                        >
                            {subjects.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* حقل الوصف */}
                    <div>
                        <label style={{ display: 'block', color: '#0B2447', fontWeight: 'bold', marginBottom: '8px' }}>وصف مختصر (اختياري)</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="ملاحظات للطلاب أو تفاصيل عن محتوى المحاضرة..."
                            rows="3"
                            style={{
                                width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #ddd', 
                                outline: 'none', background: '#fcfdfe', fontSize: '15px', resize: 'none'
                            }}
                        ></textarea>
                    </div>

                    {/* منطقة رفع الملف */}
                    <div>
                        <label style={{ display: 'block', color: '#0B2447', fontWeight: 'bold', marginBottom: '8px' }}>ملف المحاضرة (PDF)</label>
                        <div style={{
                            border: '2px dashed #00adb5', borderRadius: '12px', padding: '20px', textAlign: 'center', 
                            background: '#f4f7f6', cursor: 'pointer', transition: '0.3s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#eef6f6'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#f4f7f6'}
                        >
                            <input 
                                type="file" 
                                accept="application/pdf"
                                onChange={(e) => setFile(e.target.files[0])}
                                style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
                            />
                            {file && <p style={{ color: '#0B2447', marginTop: '10px', fontWeight: 'bold' }}>تم اختيار: {file.name}</p>}
                        </div>
                    </div>

                    {/* رسائل الحالة (نجاح / خطأ) */}
                    {status.message && (
                        <div style={{
                            padding: '12px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold',
                            background: status.type === 'error' ? '#ffebee' : status.type === 'success' ? '#e8f5e9' : '#e3f2fd',
                            color: status.type === 'error' ? '#c62828' : status.type === 'success' ? '#2e7d32' : '#1565c0'
                        }}>
                            {status.message}
                        </div>
                    )}

                    {/* زر الرفع */}
                    <button 
                        type="submit" 
                        disabled={status.loading}
                        style={{
                            background: '#0B2447', color: 'white', border: 'none', padding: '16px', borderRadius: '12px',
                            fontSize: '16px', fontWeight: 'bold', cursor: status.loading ? 'not-allowed' : 'pointer',
                            boxShadow: '0 8px 20px rgba(11, 36, 71, 0.2)', marginTop: '10px', transition: '0.3s',
                            opacity: status.loading ? 0.7 : 1
                        }}
                    >
                        {status.loading ? 'جاري الرفع...' : 'رفع المحاضرة'}
                    </button>
                </form>
            </div>
        </div>
    );
}