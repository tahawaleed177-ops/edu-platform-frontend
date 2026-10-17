import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Schedule() {
    const { user } = useContext(AuthContext);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    // حالة نموذج الإضافة (للمشرفين فقط)
    const [formData, setFormData] = useState({
        day_index: '0',
        day_name: 'الأحد',
        subject_name: '',
        start_time: '',
        end_time: '',
        location: ''
    });

    const isAdmin = user?.isAdmin || (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).isAdmin);
    const API_URL = 'https://edu-platform-backend-alpha.vercel.app/api/schedule';

    // تحديث الوقت كل دقيقة لضمان تفاعل الجدول
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            const response = await axios.get(API_URL);
            if (response.data.success) {
                setSchedule(response.data.schedule);
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    // التحقق مما إذا كانت المحاضرة فعالة الآن (اللون الأخضر)
    const isCurrentSession = (dayIndex, startTime, endTime) => {
        const currentDay = currentTime.getDay(); // 0 = Sunday, 1 = Monday...
        if (currentDay !== parseInt(dayIndex)) return false;

        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        const nowHour = currentTime.getHours();
        const nowMin = currentTime.getMinutes();
        
        const nowTimeInMins = nowHour * 60 + nowMin;
        const startTimeInMins = startHour * 60 + startMin;
        const endTimeInMins = endHour * 60 + endMin;

        return nowTimeInMins >= startTimeInMins && nowTimeInMins <= endTimeInMins;
    };

    // دوال المشرفين (إضافة وحذف)
    const handleDayChange = (e) => {
        const selectedIndex = e.target.value;
        const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        setFormData({ ...formData, day_index: selectedIndex, day_name: dayNames[selectedIndex] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(API_URL, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSchedule();
            setFormData({ ...formData, subject_name: '', start_time: '', end_time: '', location: '' });
            alert('تمت إضافة المحاضرة بنجاح!');
        } catch (error) {
            alert('حدث خطأ أثناء الإضافة');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذه المحاضرة؟')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSchedule();
        } catch (error) {
            alert('حدث خطأ أثناء الحذف');
        }
    };

    // تجميع المحاضرات حسب الأيام
    const groupedSchedule = schedule.reduce((acc, curr) => {
        if (!acc[curr.day_name]) acc[curr.day_name] = [];
        acc[curr.day_name].push(curr);
        return acc;
    }, {});

    const daysOrder = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', minHeight: '85vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ color: '#0B2447', fontSize: '32px', fontWeight: '900', margin: '0 0 10px 0' }}>📅 الجدول الدراسي التفاعلي</h2>
                <p style={{ color: '#666' }}>يتم تظليل المحاضرة الحالية باللون الأخضر تلقائياً</p>
            </div>

            {isAdmin && (
                <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '40px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                    <select value={formData.day_index} onChange={handleDayChange} style={{ padding: '10px', borderRadius: '8px' }} required>
                        {daysOrder.map((day, index) => <option key={index} value={index}>{day}</option>)}
                    </select>
                    <input type="text" placeholder="اسم المادة" value={formData.subject_name} onChange={e => setFormData({...formData, subject_name: e.target.value})} style={{ padding: '10px', borderRadius: '8px' }} required />
                    <input type="time" title="وقت البداية" value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} style={{ padding: '10px', borderRadius: '8px' }} required />
                    <input type="time" title="وقت النهاية" value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} style={{ padding: '10px', borderRadius: '8px' }} required />
                    <input type="text" placeholder="القاعة / المختبر" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ padding: '10px', borderRadius: '8px' }} required />
                    <button type="submit" style={{ background: '#00adb5', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>+ إضافة للجدول</button>
                </form>
            )}

            {loading ? (
                <p style={{ textAlign: 'center' }}>جاري التحميل...</p>
            ) : Object.keys(groupedSchedule).length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888' }}>الجدول فارغ حالياً.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {daysOrder.map(day => {
                        if (!groupedSchedule[day]) return null;
                        return (
                            <div key={day} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                                <div style={{ background: '#0B2447', color: 'white', padding: '15px 20px', fontSize: '18px', fontWeight: 'bold' }}>
                                    يوم {day}
                                </div>
                                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {groupedSchedule[day].map(session => {
                                        const active = isCurrentSession(session.day_index, session.start_time, session.end_time);
                                        return (
                                            <div key={session.id} style={{ 
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px',
                                                padding: '15px', borderRadius: '8px',
                                                border: active ? '2px solid #4CAF50' : '1px solid #eee',
                                                background: active ? '#e8f5e9' : '#fcfdfe',
                                                position: 'relative'
                                            }}>
                                                <div style={{ flex: '1', minWidth: '200px' }}>
                                                    <h3 style={{ margin: '0 0 5px 0', color: active ? '#2e7d32' : '#333' }}>{session.subject_name}</h3>
                                                    <span style={{ color: '#666', fontSize: '14px' }}>📍 {session.location}</span>
                                                </div>
                                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: active ? '#2e7d32' : '#0B2447', background: active ? '#c8e6c9' : '#e0e0e0', padding: '5px 15px', borderRadius: '20px' }}>
                                                    {session.start_time} - {session.end_time}
                                                </div>
                                                {isAdmin && (
                                                    <button onClick={() => handleDelete(session.id)} style={{ background: '#ffebee', color: '#c62828', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' }}>حذف</button>
                                                )}
                                                {active && <span style={{ position: 'absolute', top: '-10px', right: '15px', background: '#4CAF50', color: 'white', fontSize: '12px', padding: '2px 8px', borderRadius: '10px' }}>محاضرة الآن</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}