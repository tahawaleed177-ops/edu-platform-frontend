import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MaterialCard({ material, isAdmin, onDelete, onPreview, isCompleted, onToggleComplete }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loadingFav, setLoadingFav] = useState(false);
    const [loadingProg, setLoadingProg] = useState(false);

    const fullFileUrl = material.file_url?.startsWith('http')
        ? material.file_url
        : `https://edu-platform-backend-alpha.vercel.app${material.file_url?.startsWith('/') ? material.file_url : `/\${material.file_url}`}`;

    useEffect(() => {
        if (window.location.pathname === '/favorites') {
            setIsFavorite(true);
        }
    }, []);

    // دالة إضافة أو إزالة المفضلة
    const toggleFavorite = async () => {
        setLoadingFav(true);
        try {
            const token = localStorage.getItem('token');
            const API_URL = 'https://edu-platform-backend-alpha.vercel.app/api/favorites';

            if (isFavorite) {
                await axios.delete(`${API_URL}/${material.id}`, { headers: { Authorization: `Bearer ${token}` } });
                setIsFavorite(false);
                if (window.location.pathname === '/favorites') window.location.reload(); 
            } else {
                await axios.post(API_URL, { material_id: material.id }, { headers: { Authorization: `Bearer ${token}` } });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            alert('حدث خطأ أثناء تعديل المفضلة');
        } finally {
            setLoadingFav(false);
        }
    };

    // دالة تحديث حالة تقدم المحاضرة (الإكمال)
    const toggleProgress = async () => {
        setLoadingProg(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('https://edu-platform-backend-alpha.vercel.app/api/progress/toggle', 
                { material_id: material.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success && onToggleComplete) {
                // إبلاغ الصفحة الأب (Dashboard) لتحديث شريط التقدم مباشرة
                onToggleComplete(material.id, response.data.isCompleted);
            }
        } catch (error) {
            console.error('Error toggling progress:', error);
            alert('حدث خطأ أثناء تحديث حالة الإنجاز');
        } finally {
            setLoadingProg(false);
        }
    };

    return (
        <div 
            style={{
                background: isCompleted ? '#f0fdf4' : '#fcfdfe', // خلفية خضراء خفيفة إذا مكتملة
                border: '1px solid #eef2f2',
                borderRadius: '16px',
                padding: '20px',
                // الإطار الجانبي يصبح أخضراً عند الإكمال
                borderRight: isCompleted ? '4px solid #4CAF50' : '4px solid #00adb5',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = isCompleted ? '0 5px 15px rgba(76, 175, 80, 0.15)' : '0 5px 15px rgba(0,173,181,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    
                    <h4 style={{ color: '#0B2447', fontSize: '18px', marginBottom: '10px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📄 {material.title}
                        
                        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                            {/* === زر الإكمال === */}
                            <button 
                                onClick={toggleProgress}
                                disabled={loadingProg}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '18px',
                                    cursor: loadingProg ? 'wait' : 'pointer',
                                    padding: '0 5px',
                                    transition: '0.2s',
                                    opacity: isCompleted ? 1 : 0.3, // باهت إذا لم تكتمل
                                    transform: isCompleted ? 'scale(1.1)' : 'scale(1)'
                                }}
                                title={isCompleted ? "تراجع عن الإكمال" : "تحديد كمكتمل"}
                            >
                                ✅
                            </button>

                            {/* === زر المفضلة === */}
                            <button 
                                onClick={toggleFavorite}
                                disabled={loadingFav}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '20px',
                                    cursor: loadingFav ? 'wait' : 'pointer',
                                    padding: '0 5px',
                                    transition: '0.2s',
                                    color: isFavorite ? '#FFD700' : '#ccc'
                                }}
                                title={isFavorite ? "إزالة من المراجعات" : "حفظ للمراجعة"}
                            >
                                {isFavorite ? '⭐' : '☆'}
                            </button>
                        </div>
                    </h4>

                    {isAdmin && (
                        <button
                            onClick={() => onDelete(material.id, material.title)}
                            style={{
                                background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2',
                                borderRadius: '8px', padding: '5px 10px', fontSize: '12px', fontWeight: 'bold',
                                cursor: 'pointer', transition: '0.2s', flexShrink: 0
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#ffcdd2'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#ffebee'}
                            title="حذف المحاضرة نهائياً"
                        >
                            🗑️ حذف
                        </button>
                    )}
                </div>

                <p style={{ color: '#777', fontSize: '14px', marginBottom: '20px' }}>
                    {material.description}
                </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => onPreview({ ...material, fullFileUrl })}
                    style={{
                        flex: 1, background: '#e0f7fa', color: '#00838f', border: '1px solid #b2ebf2',
                        padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', fontSize: '14px'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#b2ebf2'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#e0f7fa'}
                >
                    👁️ معاينة
                </button>
                <a
                    href={fullFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    style={{
                        flex: 1, display: 'block', textAlign: 'center', background: '#0B2447',
                        color: 'white', padding: '10px', borderRadius: '8px', textDecoration: 'none',
                        fontWeight: 'bold', fontSize: '14px', transition: '0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#19376D'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#0B2447'}
                >
                    📥 تحميل
                </a>
            </div>
        </div>
    );
}