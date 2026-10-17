import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MaterialCard from '../components/MaterialCard';

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = 'https://edu-platform-backend-alpha.vercel.app/api/favorites';

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setFavorites(response.data.favorites);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', minHeight: '85vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#0B2447', fontSize: '32px', fontWeight: '900', margin: '0 0 10px 0' }}>⭐ مراجعاتي (المفضلة)</h2>
                <p style={{ color: '#666' }}>المحاضرات التي قمت بحفظها للوصول السريع إليها</p>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', color: '#00adb5', fontWeight: 'bold' }}>جاري التحميل...</p>
            ) : favorites.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888', background: 'white', padding: '20px', borderRadius: '12px' }}>لم تقم بحفظ أي محاضرة في المفضلة بعد.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {favorites.map(material => (
                        <MaterialCard key={material.id} material={material} />
                    ))}
                </div>
            )}
        </div>
    );
}