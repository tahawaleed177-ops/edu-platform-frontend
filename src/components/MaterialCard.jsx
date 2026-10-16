import React from 'react';

export default function MaterialCard({ material, isAdmin, onDelete, onPreview }) {
    // تنسيق رابط الملف لضمان عدم تكرار الشرطة المائلة (/)
    const cleanFileUrl = material.file_url?.startsWith('/') 
        ? material.file_url 
        : `/${material.file_url}`;

    const fullFileUrl = `https://edu-platform-backend-alpha.vercel.app/${cleanFileUrl}`;

    return (
        <div 
            style={{
                background: '#fcfdfe',
                border: '1px solid #eef2f2',
                borderRadius: '16px',
                padding: '20px',
                borderRight: '4px solid #00adb5',
                transition: '0.3s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,173,181,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <h4 style={{ color: '#0B2447', fontSize: '18px', marginBottom: '10px', marginTop: 0 }}>
                        📄 {material.title}
                    </h4>

                    {/* زر الحذف يظهر للمدير فقط */}
                    {isAdmin && (
                        <button
                            onClick={() => onDelete(material.id, material.title)}
                            style={{
                                background: '#ffebee',
                                color: '#c62828',
                                border: '1px solid #ffcdd2',
                                borderRadius: '8px',
                                padding: '5px 10px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: '0.2s',
                                flexShrink: 0
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

            {/* أزرار المعاينة والتحميل */}
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => onPreview({ ...material, fullFileUrl })}
                    style={{
                        flex: 1,
                        background: '#e0f7fa',
                        color: '#00838f',
                        border: '1px solid #b2ebf2',
                        padding: '10px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: '0.2s',
                        fontSize: '14px'
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
                        flex: 1,
                        display: 'block',
                        textAlign: 'center',
                        background: '#0B2447',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        transition: '0.2s'
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