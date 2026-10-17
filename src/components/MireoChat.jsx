import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function MireoChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'mireo', text: 'مرحباً! أنا ميريو 🤖 مساعدك الذكي لهندسة الحاسوب. كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي أو إرفاق ملف لكي أشرحه لك.' }
    ]);
    const [inputMsg, setInputMsg] = useState('');
    const [attachedFileText, setAttachedFileText] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const messagesEndRef = useRef(null);

    // النزول التلقائي لأسفل المحادثة عند وصول رسالة جديدة
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // قراءة محتوى الملف المرفق (يدعم الملفات النصية، الأكواد، الخ)
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            setAttachedFileText(event.target.result);
        };
        // قراءة الملف كنص
        reader.readAsText(file);
    };

    const sendMessage = async () => {
        if (!inputMsg.trim() && !attachedFileText) return;

        const userMsg = inputMsg;
        const fileContext = attachedFileText;
        
        // عرض رسالة الطالب مع اسم الملف في واجهة المحادثة
        let displayMsg = userMsg;
        if (fileName) displayMsg += `\n\n📎 [ملف مرفق: ${fileName}]`;
        
        setMessages(prev => [...prev, { sender: 'user', text: displayMsg }]);
        setInputMsg('');
        setAttachedFileText(null);
        setFileName('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('https://edu-platform-backend-alpha.vercel.app/api/chat', {
                prompt: userMsg,
                fileText: fileContext
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setMessages(prev => [...prev, { sender: 'mireo', text: res.data.reply }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'mireo', text: 'عذراً، حدث خطأ في الاتصال. حاول مرة أخرى لاحقاً 😔' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
            
            {/* الأيقونة العائمة لفتح/إغلاق المحادثة */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '65px', height: '65px', borderRadius: '50%', background: '#00adb5',
                    color: 'white', fontSize: '30px', border: 'none', cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(0,173,181,0.4)', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', transition: '0.3s',
                    transform: isOpen ? 'scale(0.9)' : 'scale(1)'
                }}
                title="تحدث مع ميريو"
            >
                {isOpen ? '✕' : '🤖'}
            </button>

            {/* نافذة المحادثة */}
            {isOpen && (
                <div style={{
                    position: 'absolute', bottom: '85px', right: '0', width: '380px', height: '550px',
                    background: 'white', border: '1px solid #e0e5ec', borderRadius: '24px',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column',
                    overflow: 'hidden', animation: 'slideUp 0.3s ease'
                }}>
                    <style>
                        {`
                        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                        .markdown-body { font-size: 14px; line-height: 1.6; }
                        /* تنسيق الأكواد داخل المحادثة */
                        .markdown-body pre { background: #1e293b; color: #f8fafc; padding: 10px; border-radius: 8px; overflow-x: auto; direction: ltr; margin: 10px 0; }
                        .markdown-body code { font-family: monospace; }
                        body:not(.dark-mode) .markdown-body code { background: #e2e8f0; color: #b91c1c; padding: 2px 5px; border-radius: 4px; }
                        body.dark-mode .markdown-body code { background: #334155; color: #fca5a5; padding: 2px 5px; border-radius: 4px; }
                        
                        /* توافق نافذة المحادثة مع الوضع الليلي */
                        body.dark-mode .mireo-window { background: #1f2937 !important; border-color: #374151 !important; }
                        body.dark-mode .mireo-input-area { background: #111827 !important; border-color: #374151 !important; }
                        body.dark-mode .mireo-input { background: #1f2937 !important; color: white !important; border-color: #374151 !important; }
                        `}
                    </style>

                    {/* رأس النافذة */}
                    <div style={{ background: '#0B2447', color: 'white', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ fontSize: '30px' }}>🤖</div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '18px' }}>Mireo (ميريو)</h3>
                            <p style={{ margin: 0, fontSize: '12px', color: '#00adb5' }}>مساعد الذكاء الاصطناعي الخاص بك</p>
                        </div>
                    </div>

                    {/* منطقة الرسائل */}
                    <div className="mireo-window" style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                alignSelf: msg.sender === 'user' ? 'flex-start' : 'flex-end',
                                background: msg.sender === 'user' ? '#00adb5' : (msg.sender === 'mireo' ? '#e2e8f0' : '#f1f5f9'),
                                color: msg.sender === 'user' ? 'white' : '#0f172a',
                                padding: '12px 18px', borderRadius: '16px', maxWidth: '85%',
                                borderBottomLeftRadius: msg.sender === 'user' ? '0' : '16px',
                                borderBottomRightRadius: msg.sender === 'user' ? '16px' : '0',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
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
                                ⏳ ميريو يفكر...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* منطقة الإدخال وإرفاق الملفات */}
                    <div className="mireo-input-area" style={{ padding: '15px', background: 'white', borderTop: '1px solid #e0e5ec' }}>
                        {fileName && (
                            <div style={{ fontSize: '12px', color: '#00adb5', marginBottom: '8px', display: 'flex', gap: '5px' }}>
                                📎 تم إرفاق: {fileName}
                                <button onClick={() => { setFileName(''); setAttachedFileText(null); }} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>✕</button>
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <label style={{ background: '#f1f5f9', padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                📎
                                <input type="file" accept=".txt,.js,.cpp,.html,.json,.csv" style={{ display: 'none' }} onChange={handleFileUpload} />
                            </label>
                            
                            <input 
                                className="mireo-input"
                                type="text" 
                                value={inputMsg}
                                onChange={(e) => setInputMsg(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="اسأل ميريو..."
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e0e5ec', outline: 'none' }}
                            />
                            
                            <button 
                                onClick={sendMessage}
                                disabled={isLoading}
                                style={{ background: '#0B2447', color: 'white', border: 'none', padding: '0 20px', borderRadius: '12px', cursor: 'pointer' }}
                            >
                                ➤
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}