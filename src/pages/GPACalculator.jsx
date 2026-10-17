import React, { useState } from 'react';

export default function GPACalculator() {
    // بيانات المواد مع عدد الوحدات (يمكنك تعديل الوحدات لاحقاً)
    const semester1 = [
        { id: 's1_1', name: 'أساسيات شبكات الحاسوب', units: 3, icon: '🌐' },
        { id: 's1_2', name: 'إلكترونيات رقمية', units: 3, icon: '⚡' },
        { id: 's1_3', name: 'برمجة كينونية', units: 3, icon: '💻' },
        { id: 's1_4', name: 'أنظمة تشغيل', units: 3, icon: '🖥️' },
        { id: 's1_5', name: 'رياضيات 3', units: 3, icon: '📐' },
        { id: 's1_6', name: 'لغة عربية 1', units: 1, icon: '📖' },
        { id: 's1_7', name: 'جرائم حزب البعث', units: 1, icon: '📜' },
    ];

    const semester2 = [
        { id: 's2_1', name: 'شبكات حاسوب متقدمة', units: 3, icon: '📡' },
        { id: 's2_2', name: 'معمارية الحاسوب', units: 3, icon: '🏗️' },
        { id: 's2_3', name: 'هياكل البيانات', units: 3, icon: '🗂️' },
        { id: 's2_4', name: 'أنظمة قواعد البيانات', units: 3, icon: '🗄️' },
        { id: 's2_5', name: 'رياضيات 4', units: 3, icon: '📏' },
        { id: 's2_6', name: 'لغة إنكليزية', units: 1, icon: '📝' },
    ];

    // حالة (State) لحفظ درجات الطالب
    const [grades, setGrades] = useState({});

    // تحديث الدرجة عند الكتابة
    const handleGradeChange = (id, value) => {
        const val = parseFloat(value);
        setGrades(prev => ({
            ...prev,
            [id]: isNaN(val) ? '' : (val > 100 ? 100 : (val < 0 ? 0 : val))
        }));
    };

    // دالة لحساب المعدل بناءً على مصفوفة المواد
    const calculateAverage = (semester) => {
        let totalPoints = 0;
        let totalUnits = 0;

        semester.forEach(subject => {
            const grade = grades[subject.id];
            if (grade !== undefined && grade !== '') {
                totalPoints += grade * subject.units;
                totalUnits += subject.units;
            }
        });

        if (totalUnits === 0) return 0;
        return (totalPoints / totalUnits).toFixed(2);
    };

    const avgS1 = calculateAverage(semester1);
    const avgS2 = calculateAverage(semester2);

    // حساب المعدل التراكمي الكلي (مجموع النقاط الكلي / مجموع الوحدات الكلي)
    const calculateCumulative = () => {
        let totalPoints = 0;
        let totalUnits = 0;

        [...semester1, ...semester2].forEach(subject => {
            const grade = grades[subject.id];
            if (grade !== undefined && grade !== '') {
                totalPoints += grade * subject.units;
                totalUnits += subject.units;
            }
        });

        if (totalUnits === 0) return 0;
        return (totalPoints / totalUnits).toFixed(2);
    };

    const cumulativeAvg = calculateCumulative();

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', minHeight: '80vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#0B2447', fontSize: '32px', fontWeight: '900', margin: '0 0 10px 0' }}>
                    📊 حاسبة المعدل التراكمي
                </h2>
                <p style={{ color: '#666', fontSize: '16px' }}>أدخل درجاتك المتوقعة (من 100) لحساب معدلك بدقة</p>
            </div>

            {/* شريط عرض المعدلات الثابت في الأعلى */}
            <div style={{ 
                background: '#0B2447', borderRadius: '20px', padding: '25px', marginBottom: '30px', 
                display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '15px', color: 'white',
                boxShadow: '0 10px 20px rgba(11,36,71,0.2)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: '0 0 5px 0', color: '#00adb5', fontWeight: 'bold' }}>معدل الكورس الأول</p>
                    <h3 style={{ margin: 0, fontSize: '28px' }}>{avgS1}%</h3>
                </div>
                <div style={{ textAlign: 'center', borderRight: '1px solid #19376D', paddingRight: '30px' }}>
                    <p style={{ margin: '0 0 5px 0', color: '#00adb5', fontWeight: 'bold' }}>معدل الكورس الثاني</p>
                    <h3 style={{ margin: 0, fontSize: '28px' }}>{avgS2}%</h3>
                </div>
                <div style={{ textAlign: 'center', borderRight: '1px solid #19376D', paddingRight: '30px' }}>
                    <p style={{ margin: '0 0 5px 0', color: '#FFD700', fontWeight: 'bold' }}>المعدل التراكمي الكلي</p>
                    <h3 style={{ margin: 0, fontSize: '32px', color: '#FFD700' }}>{cumulativeAvg}%</h3>
                </div>
            </div>

            {/* الجداول لإدخال الدرجات */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                
                {/* الكورس الأول */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: '#0B2447', borderBottom: '2px solid #f0f3f3', paddingBottom: '15px', marginBottom: '20px' }}>
                        الكورس الأول
                    </h3>
                    {semester1.map(subject => (
                        <div key={subject.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>{subject.icon}</span>
                                <div>
                                    <h4 style={{ margin: 0, color: '#0B2447', fontSize: '15px' }}>{subject.name}</h4>
                                    <span style={{ fontSize: '12px', color: '#888' }}>({subject.units} وحدات)</span>
                                </div>
                            </div>
                            <input
                                type="number"
                                min="0" max="100"
                                placeholder="الدرجة"
                                value={grades[subject.id] !== undefined ? grades[subject.id] : ''}
                                onChange={(e) => handleGradeChange(subject.id, e.target.value)}
                                style={{
                                    width: '70px', padding: '8px', borderRadius: '8px', border: '1px solid #ccc',
                                    textAlign: 'center', fontSize: '16px', fontWeight: 'bold', outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#00adb5'}
                                onBlur={(e) => e.target.style.borderColor = '#ccc'}
                            />
                        </div>
                    ))}
                </div>

                {/* الكورس الثاني */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: '#0B2447', borderBottom: '2px solid #f0f3f3', paddingBottom: '15px', marginBottom: '20px' }}>
                        الكورس الثاني
                    </h3>
                    {semester2.map(subject => (
                        <div key={subject.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>{subject.icon}</span>
                                <div>
                                    <h4 style={{ margin: 0, color: '#0B2447', fontSize: '15px' }}>{subject.name}</h4>
                                    <span style={{ fontSize: '12px', color: '#888' }}>({subject.units} وحدات)</span>
                                </div>
                            </div>
                            <input
                                type="number"
                                min="0" max="100"
                                placeholder="الدرجة"
                                value={grades[subject.id] !== undefined ? grades[subject.id] : ''}
                                onChange={(e) => handleGradeChange(subject.id, e.target.value)}
                                style={{
                                    width: '70px', padding: '8px', borderRadius: '8px', border: '1px solid #ccc',
                                    textAlign: 'center', fontSize: '16px', fontWeight: 'bold', outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#00adb5'}
                                onBlur={(e) => e.target.style.borderColor = '#ccc'}
                            />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}