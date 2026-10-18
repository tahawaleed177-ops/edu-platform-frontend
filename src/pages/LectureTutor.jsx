import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { AuthContext } from '../context/AuthContext';

export default function LectureTutor() {
    const { user } = useContext(AuthContext);
    const [materials, setMaterials] = useState([]);
    const [selectedLectureId, setSelectedLectureId] = useState('');
    const [lectureText, setLectureText] = useState('');
    
    const [messages, setMessages] = useState([
        { sender: 'mireo', text: 'مرحباً. يرجى تحديد محاضرة من القائمة الجانبية لطرح أسئلتك حولها.' }
    ]);
    const [inputMsg, setInputMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const COURSE_SUBJECTS = {
        "الكورس الأول": [
            { id: 1, name: 'أساسيات شبكات الحاسوب' }, { id: 2, name: 'إلكترونيات رقمية' },
            { id: 3, name: 'برمجة كينونية' }, { id: 4, name: 'أنظمة تشغيل' },
            { id: 5, name: 'رياضيات 3' }, { id: 6, name: 'لغة عربية 1' }, { id: 7, name: 'جرائم حزب البعث' }
        ],
        "الكورس الثاني": [
            { id: 8, name: 'شبكات حاسوب متقدمة' }, { id: 9, name: 'معمارية الحاسوب' },
            { id: 10, name: 'هياكل البيانات' }, { id: 11, name: 'أنظمة قواعد البيانات' },
            { id: 12, name: 'رياضيات 4' }, { id: 13, name: 'لغة إنكليزية' }
        ]
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const fetchAllMaterials = async () => {
            let allFetchedMaterials = [];
            const allSubjectIds = [
                ...COURSE_SUBJECTS["الكورس الأول"].map(s => s.id),
                ...COURSE_SUBJECTS["الكورس الثاني"].map(s => s.id)
            ];

            try {
                for (let subjectId of allSubjectIds) {
                    try {
                        const response = await axios.get(`https://edu-platform-backend-alpha.vercel.app/api/materials/subject/${subjectId}`);
                        if (response.data.success && response.data.materials) {
                            allFetchedMaterials = [...allFetchedMaterials, ...response.data.materials];
                        }
                    } catch (err) {}
                }
                setMaterials(allFetchedMaterials);
            } catch (error) {
                console.error("خطأ في جلب المحاضرات:", error);
            }
        };
        fetchAllMaterials();
    }, []);

    const handleLectureSelect = (lecture) => {
        setSelectedLectureId(lecture.id);
        setLectureText(`عنوان المحاضرة: ${lecture.title}\nرابط الملف: ${lecture.fileUrl}\n\nالنص الخاص بالمحاضرة للمناقشة: \n`);
        setMessages([{ sender: 'mireo', text: `تم تحديد محاضرة "${lecture.title}". كيف يمكنني مساعدتك بها؟` }]);
    };

    const handleClearChat = () => {
        setMessages([{ sender: 'mireo', text: 'تم تفريغ المحادثة. يمكنك طرح سؤال جديد.' }]);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        // يمكن إضافة إشعار بسيط هنا (Toast) مستقبلاً
    };

    const sendMessage = async () => {
        if (!inputMsg.trim()) return;

        const userMsg = inputMsg;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInputMsg('');
        setIsLoading(true);

        try {
            const token = user?.token || localStorage.getItem('token');
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
            setMessages(prev => [...prev, { sender: 'mireo', text: 'حدث خطأ في الاتصال بالخادم.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 70px)', background: 'var(--bg-color, #f8fafc)', padding: '25px', gap: '25px', flexWrap: 'wrap', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            
            <style>
                {`
                .markdown-body pre { background: #0f172a; color: #f8fafc; padding: 12px; border-radius: 8px; overflow-x: auto; direction: ltr; margin: 10px 0; font-size: 13px; }
                .markdown-body code { font-family: monospace; background: #e2e8f0; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
                .markdown-body p { margin-bottom: 8px; line-height: 1.7; }
                
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                
                body.dark-mode .markdown-body code { background: #334155; color: #e2e8f0; }
                body.dark-mode .ui-panel { background: #1e293b !important; border-color: #334155 !important; color: #f8fafc !important; }
                
                /* تأثير مؤشر الكتابة */
                .typing-indicator span { display: inline-block; width: 6px; height: 6px; background-color: #64748b; border-radius: 50%; margin: 0 2px; animation: bounce 1.4s infinite ease-in-out both; }
                .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
                .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
                @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
                
                /* تأثيرات أزرار الراديو المخصصة */
                .lecture-item { border: 1px solid transparent; transition: all 0.2s ease; }
                .lecture-item:hover { background: #f1f5f9; border-radius: 8px; padding-left: 5px; }
                .lecture-item.active { background: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 8px; padding-left: 5px; }
                `}
            </style>

            {/* القائمة الجانبية (المنهج) */}
            <div className="ui-panel custom-scrollbar" style={{ 
                flex: '1 1 260px', maxWidth: '320px', background: 'white', borderRadius: '16px', 
                padding: '25px', overflowY: 'auto', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', 
                display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0'
            }}>
                <h3 style={{ margin: '0 0 20px 0', color: '#0f172a', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px' }}>
                    المقررات الدراسية
                </h3>

                {Object.entries(COURSE_SUBJECTS).map(([courseName, subjects]) => (
                    <div key={courseName} style={{ marginBottom: '30px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>
                            {courseName}
                        </div>
                        
                        {subjects.map(sub => {
                            const subjectLectures = materials.filter(m => m.subject_id === sub.id || m.subjectId === sub.id || m.subject === sub.id);
                            return (
                                <div key={sub.id} style={{ marginBottom: '18px' }}>
                                    <strong style={{ fontSize: '14px', color: '#334155', display: 'block', marginBottom: '8px' }}>{sub.name}</strong>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {subjectLectures.length > 0 ? (
                                            subjectLectures.map(lecture => (
                                                <label key={lecture.id} className={`lecture-item ${selectedLectureId === lecture.id ? 'active' : ''}`} style={{ 
                                                    display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', 
                                                    cursor: 'pointer', padding: '6px 8px', color: selectedLectureId === lecture.id ? '#0d9488' : '#475569',
                                                    fontWeight: selectedLectureId === lecture.id ? '600' : '400'
                                                }}>
                                                    <input 
                                                        type="radio" 
                                                        name="lectureSelection" 
                                                        checked={selectedLectureId === lecture.id}
                                                        onChange={() => handleLectureSelect(lecture)}
                                                        style={{ accentColor: '#0d9488', cursor: 'pointer', margin: 0 }}
                                                    />
                                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lecture.title}</span>
                                                </label>
                                            ))
                                        ) : (
                                            <span style={{ fontSize: '12px', color: '#cbd5e1', padding: '0 8px' }}>لا توجد ملفات</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* مساحة العمل الرئيسية */}
            <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
                
                {/* منطقة محتوى المحاضرة */}
                <div className="ui-panel" style={{ 
                    flex: '0 0 30%', background: 'white', borderRadius: '16px', padding: '20px', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3 style={{ margin: 0, color: '#0f172a', fontSize: '15px', fontWeight: '600' }}>محتوى المحاضرة المرجعي</h3>
                    </div>
                    <textarea 
                        value={lectureText}
                        onChange={(e) => setLectureText(e.target.value)}
                        placeholder="اختر محاضرة لتضمينها كمرجع للذكاء الاصطناعي، أو الصق محتوى إضافي هنا..."
                        className="custom-scrollbar ui-panel"
                        style={{ 
                            flex: 1, width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', 
                            resize: 'none', fontSize: '14px', lineHeight: '1.6', outline: 'none', background: '#f8fafc', color: '#334155'
                        }}
                    />
                </div>

                {/* منطقة الدردشة */}
                <div className="ui-panel" style={{ 
                    flex: 1, background: 'white', borderRadius: '16px', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #e2e8f0'
                }}>
                    {/* هيدر الدردشة */}
                    <div style={{ borderBottom: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: '600' }}>ميريو (Mireo)</h3>
                            <span style={{ fontSize: '12px', color: '#0d9488', fontWeight: '500' }}>مساعد أكاديمي • متصل</span>
                        </div>
                        <button 
                            onClick={handleClearChat}
                            style={{ background: 'transparent', border: '1px solid #e2e8f0', color: '#64748b', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '500', transition: '0.2s' }}
                            onMouseOver={(e) => { e.target.style.background = '#fee2e2'; e.target.style.color = '#ef4444'; e.target.style.borderColor = '#fca5a5'; }}
                            onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#64748b'; e.target.style.borderColor = '#e2e8f0'; }}
                        >
                            تفريغ المحادثة
                        </button>
                    </div>

                    {/* سجل الرسائل */}
                    <div className="custom-scrollbar" style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                alignSelf: msg.sender === 'user' ? 'flex-start' : 'flex-end',
                                maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: '4px'
                            }}>
                                <div style={{
                                    background: msg.sender === 'user' ? '#0f172a' : '#f1f5f9',
                                    color: msg.sender === 'user' ? 'white' : '#1e293b',
                                    padding: '14px 20px', borderRadius: '12px',
                                    borderBottomLeftRadius: msg.sender === 'user' ? '4px' : '12px',
                                    borderBottomRightRadius: msg.sender === 'user' ? '12px' : '4px',
                                    boxShadow: msg.sender === 'user' ? '0 4px 6px -1px rgba(15, 23, 42, 0.1)' : 'none',
                                    border: msg.sender === 'mireo' ? '1px solid #e2e8f0' : 'none'
                                }}>
                                    {msg.sender === 'user' ? (
                                        <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.6' }}>{msg.text}</div>
                                    ) : (
                                        <div className="markdown-body" dir="rtl">
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                                
                                {/* زر النسخ لرسائل ميريو */}
                                {msg.sender === 'mireo' && (
                                    <div style={{ alignSelf: 'flex-start', paddingRight: '8px' }}>
                                        <button 
                                            onClick={() => handleCopy(msg.text)}
                                            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', gap: '4px' }}
                                            onMouseOver={(e) => e.currentTarget.style.color = '#0d9488'}
                                            onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
                                        >
                                            نسخ
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ alignSelf: 'flex-end', background: '#f1f5f9', padding: '14px 24px', borderRadius: '12px', borderBottomRightRadius: '4px', border: '1px solid #e2e8f0' }}>
                                <div className="typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* حقل الإدخال */}
                    <div style={{ padding: '20px 24px', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                            <input 
                                className="ui-panel"
                                type="text" 
                                value={inputMsg}
                                onChange={(e) => setInputMsg(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="اكتب سؤالك هنا..."
                                style={{ flex: 1, padding: '14px 20px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', background: '#f8fafc', color: '#0f172a', transition: 'border-color 0.2s' }}
                                onFocus={(e) => e.target.style.borderColor = '#0d9488'}
                                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                            <button 
                                onClick={sendMessage}
                                disabled={isLoading || !inputMsg.trim()}
                                style={{ 
                                    background: inputMsg.trim() ? '#0f172a' : '#94a3b8', 
                                    color: 'white', border: 'none', padding: '0 24px', borderRadius: '10px', 
                                    cursor: inputMsg.trim() ? 'pointer' : 'not-allowed', fontWeight: '600', fontSize: '14px', transition: 'background 0.2s' 
                                }}
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