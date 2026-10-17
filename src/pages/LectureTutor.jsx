import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function LectureTutor() {
    const [materials, setMaterials] = useState([]);
    const [selectedLectureId, setSelectedLectureId] = useState('');
    const [lectureText, setLectureText] = useState('');
    
    const [messages, setMessages] = useState([
        { sender: 'mireo', text: 'أهلاً بك! قم بوضع علامة (صح) بجانب أي محاضرة من القائمة الجانبية، وسأكون جاهزاً لشرحها ومناقشتها معك.' }
    ]);
    const [inputMsg, setInputMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // قائمة المواد مقسمة إلى كورسات
    const COURSE_SUBJECTS = {
        "📚 الكورس الأول": [
            "برمجة كينونية", "إلكترونيات رقمية", "أساسيات شبكات الحاسوب",
            "لغة عربية 1", "رياضيات 3", "أنظمة تشغيل", "حقوق إنسان والديمقراطية"
        ],
        "📘 الكورس الثاني": [
            "هياكل بيانات", "معمارية الحاسوب", "تصميم منطقي متقدم",
            "رياضيات 4", "لغة إنجليزية", "تطبيقات حاسوبية", "مجالات كهرومغناطيسية"
        ]
    };

    // النزول التلقائي للمحادثة
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // جلب جميع المحاضرات من الباك إند
    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const token = localStorage.getItem('token'); 
                const res = await axios.get('https://edu-platform-backend-alpha.vercel.app/api/materials', {
                    headers: { Authorization: `Bearer ${token}` } 
                });
                
                // طباعة الاستجابة لمعرفة شكل البيانات القادمة من السيرفر
                console.log("📦 البيانات القادمة من الباك إند:", res.data);

                let fetchedMaterials = [];
                if (Array.isArray(res.data)) {
                    fetchedMaterials = res.data;
                } else if (res.data && Array.isArray(res.data.data)) {
                    fetchedMaterials = res.data.data;
                } else if (res.data && Array.isArray(res.data.materials)) {
                    fetchedMaterials = res.data.materials;
                }

                setMaterials(fetchedMaterials);
            } catch (error) {
                console.error("خطأ في جلب المحاضرات:", error);
            }
        };
        fetchMaterials();
    }, []);

    // دالة تتنفذ عند وضع صح على أي محاضرة
    const handleLectureSelect = (lecture) => {
        setSelectedLectureId(lecture._id);
        setLectureText(`عنوان المحاضرة: ${lecture.title}\nرابط المحاضرة: ${lecture.url}\n\n(ملاحظة لميريو: هذه المحاضرة موجودة على الرابط أعلاه. إذا أراد الطالب شرحها بالتفصيل، يجب عليه نسخ نصها ولصقه هنا بدلاً من الرابط).`);
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
        <div style={{ display: 'flex', height: 'calc(100vh - 70px)', background: 'var(--bg-color, #f4f7f6)', padding: '20px', gap: '20px', flexWrap: 'wrap' }}>
            
            <style>
                {`
                .markdown-body pre { background: #1e293b; color: #f8fafc; padding: 10px; border-radius: 8px; overflow-x: auto; direction: ltr; margin: 10px 0; }
                .markdown-body code { font-family: monospace; background: #e2e8f0; color: #b91c1c; padding: 2px 5px; border-radius: 4px; }
                body.dark-mode .markdown-body code { background: #334155; color: #fca5a5; }
                body.dark-mode .tutor-box { background: #1f2937 !important; border-color: #374151 !important; color: white !important; }
                /* تنسيق شريط التمرير الجانبي */
                .sidebar-scroll::-webkit-scrollbar { width: 6px; }
                .sidebar-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                body.dark-mode .sidebar-scroll::-webkit-scrollbar-thumb { background: #4b5563; }
                `}
            </style>

            {/* === القسم الأول: القائمة الجانبية للمنهج (Sidebar) === */}
            <div className="tutor-box sidebar-scroll" style={{ 
                flex: '1 1 280px', maxWidth: '350px', background: 'white', borderRadius: '20px', 
                padding: '20px', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column'
            }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#0B2447', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
                    📁 المنهج الدراسي
                </h3>

                {Object.entries(COURSE_SUBJECTS).map(([courseName, subjects]) => (
                    <div key={courseName} style={{ marginBottom: '25px' }}>
                        <h4 style={{ color: '#00adb5', marginBottom: '15px', fontSize: '16px' }}>{courseName}</h4>
                        
                        {subjects.map(sub => {
                            // التعديل هنا: استخدام trim() لتجاهل المسافات الزائدة في الأسماء
                            const subjectLectures = materials.filter(m => m.subject && m.subject.trim() === sub.trim());
                            return (
                                <div key={sub} style={{ marginBottom: '15px', paddingRight: '15px', borderRight: '2px solid #e2e8f0' }}>
                                    <strong style={{ fontSize: '14px', color: '#64748b' }}>📘 {sub}</strong>
                                    
                                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {subjectLectures.length > 0 ? (
                                            subjectLectures.map(lecture => (
                                                <label key={lecture._id} style={{ 
                                                    display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', 
                                                    cursor: 'pointer', transition: '0.2s',
                                                    color: selectedLectureId === lecture._id ? '#00adb5' : 'inherit',
                                                    fontWeight: selectedLectureId === lecture._id ? 'bold' : 'normal'
                                                }}>
                                                    <input 
                                                        type="radio" 
                                                        name="lectureSelection" 
                                                        checked={selectedLectureId === lecture._id}
                                                        onChange={() => handleLectureSelect(lecture)}
                                                        style={{ accentColor: '#00adb5', cursor: 'pointer', transform: 'scale(1.2)' }}
                                                    />
                                                    {lecture.title}
                                                </label>
                                            ))
                                        ) : (
                                            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginRight: '5px' }}>- لا توجد محاضرات -</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* === القسم الثاني: مساحة الدراسة والمحادثة === */}
            <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
                
                {/* صندوق نص المحاضرة */}
                <div className="tutor-box" style={{ 
                    flex: '0 0 35%', background: 'white', borderRadius: '20px', padding: '20px', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' 
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, color: '#00adb5', fontSize: '16px' }}>📄 محتوى المحاضرة المحددة</h3>
                    </div>
                    <p style={{ fontSize: '12px', color: '#888', marginTop: 0, marginBottom: '10px' }}>
                        (قم بوضع (صح) على أي محاضرة من القائمة الجانبية. لملفات الـ PDF، يفضل لصق النص هنا ليتمكن ميريو من قراءته بدقة).
                    </p>
                    
                    <textarea 
                        value={lectureText}
                        onChange={(e) => setLectureText(e.target.value)}
                        placeholder="سيظهر المحتوى هنا بمجرد تحديدك لمحاضرة..."
                        className="tutor-box sidebar-scroll"
                        style={{ 
                            flex: 1, width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #e0e5ec', 
                            resize: 'none', fontSize: '14px', lineHeight: '1.6', outline: 'none', background: '#f8fafc'
                        }}
                    />
                </div>

                {/* صندوق المحادثة مع ميريو */}
                <div className="tutor-box" style={{ 
                    flex: 1, background: 'white', borderRadius: '20px', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden'
                }}>
                    <div style={{ background: '#0B2447', color: 'white', padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ fontSize: '26px' }}>🤖</div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>مناقشة المحاضرة مع ميريو</h3>
                            <p style={{ margin: 0, fontSize: '11px', color: '#00adb5' }}>ميريو جاهز لشرح المحتوى الذي تحدده من القائمة</p>
                        </div>
                    </div>

                    <div className="sidebar-scroll" style={{ flex: 1, padding: '20px', overflowY: 'auto', background: 'rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
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