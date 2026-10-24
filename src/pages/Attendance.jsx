import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function Attendance() {
    const { user } = useContext(AuthContext);
    const [subject, setSubject] = useState('');
    const [section, setSection] = useState('');
    const [students, setStudents] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const [scanAlert, setScanAlert] = useState({ text: '', type: '' });

    const fetchStudents = async () => {
        if (!section) return alert('يرجى اختيار الشعبة أولاً');
        try {
            const token = user?.token || localStorage.getItem('token');
            const res = await axios.get(`https://edu-platform-backend-alpha.vercel.app/api/users/section/${section}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                const studentsWithStatus = res.data.students.map(s => ({ ...s, status: 'غائب' }));
                setStudents(studentsWithStatus);
                setScanAlert({ text: '', type: '' });
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            alert('حدث خطأ في جلب القائمة');
        }
    };

    useEffect(() => {
        let scanner;
        if (isScanning) {
            scanner = new Html5QrcodeScanner("reader", { fps: 5, qrbox: { width: 250, height: 250 } }, false);
            scanner.render(
                (decodedText) => {
                    const parts = decodedText.trim().split('|');
                    const cleanIdentifier = parts[0]?.toLowerCase();
                    const qrTime = parts[1] ? parseInt(parts[1], 10) : null;

                    // التحقق من صلاحية الباركود الزمنية (يسمح بـ 45 ثانية كحد أقصى)
                    if (!qrTime || isNaN(qrTime) || Math.abs(Date.now() - qrTime) > 45000) {
                        setScanAlert({
                            text: '⚠️ تم رفض الباركود! هذا الباركود قديم أو مصور (Screenshot). اطلب من الطالب فتح الباركود المباشر.',
                            type: 'error'
                        });
                        return;
                    }

                    setStudents(prev => {
                        let matchedStudentName = '';
                        const updated = prev.map(s => {
                            const isMatch = s.id?.toString() === cleanIdentifier || s.email?.trim().toLowerCase() === cleanIdentifier;
                            if (isMatch) {
                                matchedStudentName = s.full_name;
                            }
                            return isMatch ? { ...s, status: 'حاضر' } : s;
                        });

                        if (matchedStudentName) {
                            setScanAlert({ text: `✅ تم تسجيل حضور: ${matchedStudentName}`, type: 'success' });
                            const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3');
                            audio.play().catch(() => {});
                        } else {
                            setScanAlert({ text: '❌ هذا الطالب غير مسجل في هذه الشعبة!', type: 'error' });
                        }
                        return updated;
                    });
                },
                () => {}
            );
        }
        return () => {
            if (scanner) scanner.clear().catch(e => console.error(e));
        };
    }, [isScanning]);

    const toggleStatus = (id) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'غائب' ? 'حاضر' : 'غائب' } : s));
    };

    const handlePrint = () => window.print();

    const resetList = () => {
        if (window.confirm('هل أنت متأكد من تصفير قائمة الحضور وبدء محاضرة جديدة؟')) {
            setStudents(prev => prev.map(s => ({ ...s, status: 'غائب' })));
            setScanAlert({ text: '', type: '' });
        }
    };

    if (!user?.isAdmin) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>ممنوع الدخول. للمديرين فقط.</h2>;

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px', fontFamily: 'system-ui' }}>
            
            <div className="no-print" style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                <h2 style={{ color: '#0B2447', marginBottom: '20px' }}>📸 نظام تسجيل الحضور الذكي (محمي ضد الغش)</h2>
                
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <input type="text" placeholder="اسم المادة (مثال: شبكات)" value={subject} onChange={(e) => setSubject(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
                    <select value={section} onChange={(e) => setSection(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}>
                        <option value="">-- اختر الشعبة --</option>
                        <option value="GA">GA</option>
                        <option value="GB">GB</option>
                    </select>
                    <button onClick={fetchStudents} style={{ padding: '12px 25px', background: '#0B2447', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>جلب القائمة</button>
                </div>

                {students.length > 0 && (
                    <div style={{ textAlign: 'center' }}>
                        <button onClick={() => setIsScanning(!isScanning)} style={{ padding: '12px 25px', background: isScanning ? '#dc2626' : '#059669', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {isScanning ? 'إغلاق الكاميرا ⏹' : 'فتح الكاميرا للمسح 📷'}
                        </button>
                    </div>
                )}

                {scanAlert.text && (
                    <div style={{ marginTop: '15px', padding: '12px', borderRadius: '10px', fontWeight: 'bold', textAlign: 'center', background: scanAlert.type === 'success' ? '#dcfce7' : '#fee2e2', color: scanAlert.type === 'success' ? '#166534' : '#991b1b' }}>
                        {scanAlert.text}
                    </div>
                )}

                {isScanning && <div id="reader" style={{ width: '100%', maxWidth: '400px', margin: '20px auto', border: '2px solid #059669', borderRadius: '12px', overflow: 'hidden' }}></div>}
            </div>

            {students.length > 0 && (
                <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                        <h2>سجل حضور الطلاب</h2>
                        <p><strong>المادة:</strong> {subject || 'غير محدد'} | <strong>الشعبة:</strong> {section} | <strong>التاريخ:</strong> {new Date().toLocaleDateString('ar-IQ')}</p>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', color: '#0B2447' }}>
                                <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>ت</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>اسم الطالب</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>الدراسة</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>الحالة</th>
                                <th className="no-print" style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>تعديل يدوي</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={student.id} style={{ background: student.status === 'حاضر' ? '#f0fdf4' : 'transparent', borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>{index + 1}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{student.full_name}</td>
                                    <td style={{ padding: '12px' }}>{student.study_type || '-'}</td>
                                    <td style={{ padding: '12px', color: student.status === 'حاضر' ? '#166534' : '#dc2626', fontWeight: 'bold' }}>
                                        {student.status === 'حاضر' ? 'حاضر ✅' : 'غائب ❌'}
                                    </td>
                                    <td className="no-print" style={{ padding: '12px' }}>
                                        <button onClick={() => toggleStatus(student.id)} style={{ padding: '6px 12px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>عكس الحالة</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="no-print" style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <button onClick={handlePrint} style={{ padding: '12px 25px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>🖨️ طباعة أو حفظ كـ PDF</button>
                        <button onClick={resetList} style={{ padding: '12px 25px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>🔄 تصفير القائمة</button>
                    </div>
                </div>
            )}

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    .no-print { display: none !important; }
                    table, table *, h2, p { visibility: visible; }
                    table { position: absolute; left: 0; top: 0; width: 100%; }
                }
            `}</style>
        </div>
    );
}