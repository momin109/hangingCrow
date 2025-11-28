import React, { useState } from "react";

export default function MatchManagement() {
    const [matches, setMatches] = useState([
        { id: 1, sport: 'Cricket', name: 'India vs Australia', date: '2023-11-19 14:00', bookmaker: true, fancy: true, premium: false, status: true, minOdds: 1.1, maxOdds: 10 },
        { id: 2, sport: 'Soccer', name: 'Man City vs Liverpool', date: '2023-11-25 18:30', bookmaker: true, fancy: false, premium: true, status: true, minOdds: 1.01, maxOdds: 20 },
        { id: 3, sport: 'Tennis', name: 'Djokovic vs Alcaraz', date: '2023-11-20 20:00', bookmaker: false, fancy: false, premium: true, status: false, minOdds: 1.05, maxOdds: 15 },
    ]);

    const toggle = (id, field) => {
        setMatches(matches.map(m => m.id === id ? { ...m, [field]: !m[field] } : m));
    };

    return (
        <div className="page">
            <h2>Match Management</h2>

            <div className="card">
                <h4>Sports Main Market</h4>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <button>Cricket</button>
                    <button style={{ background: '#0f1a2b', border: '1px solid #22c1b6', color: '#22c1b6' }}>Soccer</button>
                    <button style={{ background: '#0f1a2b', border: '1px solid #22c1b6', color: '#22c1b6' }}>Tennis</button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #0f1a2b' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Match Name</th>
                            <th style={{ padding: '10px', textAlign: 'center' }}>Bookmaker</th>
                            <th style={{ padding: '10px', textAlign: 'center' }}>Fancy</th>
                            <th style={{ padding: '10px', textAlign: 'center' }}>Premium</th>
                            <th style={{ padding: '10px', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '10px', textAlign: 'center' }}>Odds Limit</th>
                            <th style={{ padding: '10px', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map(m => (
                            <tr key={m.id} style={{ borderBottom: '1px solid #0f1a2b20' }}>
                                <td style={{ padding: '10px' }}>
                                    <div><b>{m.name}</b></div>
                                    <small style={{ color: '#9fb0c8' }}>{m.date}</small>
                                </td>
                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                    <input type="checkbox" checked={m.bookmaker} onChange={() => toggle(m.id, 'bookmaker')} />
                                </td>
                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                    <input type="checkbox" checked={m.fancy} onChange={() => toggle(m.id, 'fancy')} />
                                </td>
                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                    <input type="checkbox" checked={m.premium} onChange={() => toggle(m.id, 'premium')} />
                                </td>
                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        background: m.status ? '#2ecc7120' : '#e74c3c20',
                                        color: m.status ? '#2ecc71' : '#e74c3c',
                                        cursor: 'pointer'
                                    }} onClick={() => toggle(m.id, 'status')}>
                                        {m.status ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </td>
                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                    <small>Min: {m.minOdds} / Max: {m.maxOdds}</small>
                                </td>
                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                    <button style={{ padding: '4px 8px', fontSize: '12px' }}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
