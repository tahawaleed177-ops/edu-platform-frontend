import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function LectureTutor() {
    const [materials, setMaterials] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedLecture, setSelectedLecture] = useState('');
    const [lectureText, setLectureText] = useState('');
    
    const [messages, setMessages] = useState([
        { sender: 'mireo', text: 'أهلاً بك في مساحة الدراسة! اختر المادة ثم المحاضرة من القوائم أعلاه لكي أقوم بقراءتها ومناقشتها معك.' }
    ]);
    const [inputMsg, setInputMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // قائمة المواد الثابتة (Hardcoded Subjects) لتظهر دائماً في القائمة المنسدلة
    const SUBJECTS_LIST = [
        "برمجة كينونية",
        "إلكترونيات رقمية",
        "أساسيات شبكات الحاسوب",
        "لغة عربية 1",
        "رياضيات 3",
        "أنظمة تشغيل",
        "حقوق إنسان والديمقراطية",
        "هيكلة بيانات" // يمكنك إضافة المزيد هنا إذا لزم الأمر
    ];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const token = localStorage.getItem('token'); 
                const res = await axios.get('https://edu-platform-backend-alpha.vercel.app/api/materials', {
                    headers: { Authorization: `Bearer ${token}` } 
                });
                const materialsData = Array.isArray(res.data) ? res.data : (res.data.data || res.data.materials || []);
                setMaterials(materialsData);
            } catch (error) {
                console.error("خطأ في جلب المحاضرات:", error);
            }
        };
        fetchMaterials();
    }, []);

    // تصفية المحاضرات بناءً على المادة المختارة
    const lecturesForSelectedSubject = materials.filter(m => m.subject === selectedSubject);

    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value);
        setSelectedLecture(''); 
        setLectureText(''); 
    };

    const handleLectureChange = (e) => {
        const lectureId = e.target.value;
        setSelectedLecture(lectureId);
        
        const lecture = materials.find(m => m._id === lectureId);
        if (lecture) {
            setLectureText(`عنوان المحاضرة: ${lecture.title}\nرابط المحاضرة: ${lecture.url}\n\n(ملاحظة لميريو: هذه المحاضرة موجودة على الرابط أعلاه. إذا أراد الطالب شرحها بالتفصيل، يجب عليه نسخ نصها ولصقه هنا بدلاً من الرابط).`);
        } else {
            setLectureText('');
        }
    };

    const sendMessage = async () => {
        if (!inputMsg.trim()) return;

        const userMsg = inputMsg;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInputMsg('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('https://edu-platform-backend-alpha.vercel.app/api/chat', {
                prompt: userMsg,
                fileText: lectureText 
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setMessages(prev => [...prev, { sender: 'mireo', text: res.data.reply }]);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'عذراً، حدث خطأ في الاتصال 😔';
            setMessages(prev => [...prev, { sender: 'mireo', text: errorMsg }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 70px)', background: 'var(--bg-color, #f4f7f6)', padding: '20px', gap: '20px' }}>
            
            <style>
                {`
                .markdown-body pre { background: #1e293b; color: #f8fafc; padding: 10px; border-radius: 8px; overflow-x: auto; direction: ltr; margin: 10px 0; }
                .markdown-body code { font-family: monospace; background: #e2e8f0; color: #b91c1c; padding: 2px 5px; border-radius: 4px; }
                body.dark-mode .markdown-body code { background: #334155; color: #fca5a5; }
                body.dark-mode .tutor-box { background: #1f2937 !important; border-color: #374151 !important; color: white !important; }
                body.dark-mode select { background: #374151 !important; color: white !important; border-color: #4b5563 !important; }
                `}
            </style>

            <div className="tutor-box" style={{ 
                background: 'white', borderRadius: '15px', padding: '15px 25px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap'
            }}>
                <h3 style={{ margin: 0, color: '#0B2447' }}>📚 اختر المحاضرة:</h3>
                
                <select 
                    value={selectedSubject} 
                    onChange={handleSubjectChange}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e0e5ec', outline: 'none', minWidth: '200px' }}
                >
                    <option value="">-- اختر المادة --</option>
                    {SUBJECTS_LIST.map((sub, idx) => (
                        <option key={idx} value={sub}>{sub}</option>
                    ))}
                </select>

                <select 
                    value={selectedLecture} 
                    onChange={handleLectureChange}
                    disabled={!selectedSubject}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e0e5ec', outline: 'none', minWidth: '250px' }}
                >
                    <option value="">-- اختر المحاضرة --</option>
                    {lecturesForSelectedSubject.length > 0 ? (
                        lecturesForSelectedSubject.map(lecture => (
                            <option key={lecture._id} value={lecture._id}>{lecture.title}</option>
                        ))
                    ) : (
                        <option value="" disabled>لا توجد محاضرات مرفوعة لهذه المادة</option>
                    )}
                </select>
            </div>

            <div style={{ display: 'flex', gap: '20px', flex: 1, overflow: 'hidden', flexWrap: 'wrap' }}>
                <div className="tutor-box" style={{ 
                    flex: '1 1 45%', background: 'white', borderRadius: '20px', padding: '20px', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' 
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ margin: 0, color: '#00adb5' }}>📄 محتوى المحاضرة الحالي</h3>
                    </div>
                    <p style={{ fontSize: '13px', color: '#888', marginTop: 0 }}>
                        ملاحظة هامة: بما أن المنصة تدعم رفع روابط PDF أو YouTube، فقد لا يستطيع ميريو قراءة محتوى الرابط مباشرة. 
                        يفضل نسخ النصوص الهامة من الـ PDF ولصقها هنا ليتمكن من شرحها بدقة.
                    </p>
                    
                    <textarea 
                        value={lectureText}
                        onChange={(e) => setLectureText(e.target.value)}
                        placeholder="اختر محاضرة من الأعلى، أو قم بلصق نص المحاضرة يدوياً هنا..."
                        className="tutor-box"
                        style={{ 
                            flex: 1, width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #e0e5ec', 
                            resize: 'none', fontSize: '15px', lineHeight: '1.6', outline: 'none', background: '#f8fafc'
                        }}
                    />
                </div>

                <div className="tutor-box" style={{ 
                    flex: '1 1 45%', background: 'white', borderRadius: '20px', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden'
                }}>
                    <div style={{ background: '#0B2447', color: 'white', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ fontSize: '30px' }}>🤖</div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '18px' }}>مناقشة المحاضرة مع ميريو</h3>
                            <p style={{ margin: 0, fontSize: '12px', color: '#00adb5' }}>ميريو جاهز لشرح المحتوى المجاور</p>
                        </div>
                    </div>

                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: 'rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                alignSelf: msg.sender === 'user' ? 'flex-start' : 'flex-end',
                                background: msg.sender === 'user' ? '#00adb5' : (msg.sender === 'mireo' ? '#e2e8f0' : '#f1f5f9'),
                                color: msg.sender === 'user' ? 'white' : '#0f172a',
                                padding: '12px 18px', borderRadius: '16px', maxWidth: '85%',
                                borderBottomLeftRadius: msg.sender === 'user' ? '0' : '16px',
                                borderBottomRightRadius: msg.sender === 'user' ? '16px' : '0'
                            }}>
                                {msg.sender === 'user' ? (
                                    <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>{msg.text}</div>
                                ) : (
                                    <div className="markdown-body" dir="rtl">
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ alignSelf: 'flex-end', background: '#e2e8f0', color: '#0f172a', padding: '12px 18px', borderRadius: '16px', borderBottomRightRadius: '0' }}>
                                ⏳ ميريو يقرأ المحتوى...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div style={{ padding: '15px', background: 'transparent', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input 
                                className="tutor-box"
                                type="text" 
                                value={inputMsg}
                                onChange={(e) => setInputMsg(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="اسأل عن أي جزء في المحاضرة..."
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e0e5ec', outline: 'none' }}
                            />
                            <button 
                                onClick={sendMessage}
                                disabled={isLoading}
                                style={{ background: '#0B2447', color: 'white', border: 'none', padding: '0 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                إرسال
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}