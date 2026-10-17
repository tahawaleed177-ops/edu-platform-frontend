import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function LectureTutor() {
    const [lectureText, setLectureText] = useState('');
    const [messages, setMessages] = useState([
        { sender: 'mireo', text: 'أهلاً بك في مساحة الدراسة! قم بلصق نص المحاضرة في المربع الجانبي، أو ارفع ملفاً، ثم اسألني لكي أشرحه لك أو ألخصه.' }
    ]);
    const [inputMsg, setInputMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // قراءة الملف النصي
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setLectureText(event.target.result);
        };
        reader.readAsText(file);
    };

    const sendMessage = async () => {
        if (!inputMsg.trim()) return;

        const userMsg = inputMsg;
        
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInputMsg('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            // نرسل نص المحاضرة كـ fileText مع كل رسالة لكي يتذكره ميريو
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
                `}
            </style>

            {/* النصف الأول: منطقة المحاضرة (Lecture Content) */}
            <div className="tutor-box" style={{ 
                flex: '1 1 45%', background: 'white', borderRadius: '20px', padding: '20px', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' 
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, color: '#00adb5' }}>📄 محتوى المحاضرة</h3>
                    <label style={{ 
                        background: '#0B2447', color: 'white', padding: '8px 15px', 
                        borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'
                    }}>
                        📎 رفع ملف نصي
                        <input type="file" accept=".txt,.md,.js,.cpp,.csv,.json" style={{ display: 'none' }} onChange={handleFileUpload} />
                    </label>
                </div>
                <p style={{ fontSize: '13px', color: '#888', marginTop: 0 }}>ملاحظة: لملفات PDF، قم بنسخ النص من الـ PDF ولصقه في المربع بالأسفل.</p>
                
                <textarea 
                    value={lectureText}
                    onChange={(e) => setLectureText(e.target.value)}
                    placeholder="قم بلصق نص المحاضرة هنا أو ارفع ملفاً ليقوم ميريو بقراءته..."
                    className="tutor-box"
                    style={{ 
                        flex: 1, width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #e0e5ec', 
                        resize: 'none', fontSize: '15px', lineHeight: '1.6', outline: 'none', background: '#f8fafc'
                    }}
                />
            </div>

            {/* النصف الثاني: محادثة ميريو (Mireo Chat) */}
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
                            ⏳ ميريو يقرأ المحاضرة...
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
    );
}