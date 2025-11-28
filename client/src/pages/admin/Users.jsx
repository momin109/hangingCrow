import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadUsers();
    }, [page]);

    async function loadUsers() {
        try {
            const res = await axios.get(`/api/users?page=${page}&limit=10`);
            setUsers(res.data.data);
            setTotalPages(res.data.meta.totalPages);
        } catch (e) {
            console.error('Failed to load users', e);
        }
    }

    return (
        <div className="page">
            <h2>Users Management</h2>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h4>All Users</h4>
                    <div>
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ marginRight: '8px' }}>Prev</button>
                        <span>Page {page} of {totalPages}</span>
                        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ marginLeft: '8px' }}>Next</button>
                    </div>
                </div>

                {users.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #0f1a2b' }}>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Username</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Role</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>Balance</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>Exposure</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>Available</th>
                                <th style={{ padding: '8px', textAlign: 'center' }}>Children</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Parent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} style={{ borderBottom: '1px solid #0f1a2b20' }}>
                                    <td style={{ padding: '8px' }}>{u.username}</td>
                                    <td style={{ padding: '8px' }}><span style={{ background: '#22c1b6', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>{u.role}</span></td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>৳{parseFloat(u.wallet?.balance || 0).toFixed(2)}</td>
                                    <td style={{ padding: '8px', textAlign: 'right', color: '#e74c3c' }}>৳{parseFloat(u.exposure || 0).toFixed(2)}</td>
                                    <td style={{ padding: '8px', textAlign: 'right', color: '#2ecc71' }}>৳{parseFloat(u.availableBalance || 0).toFixed(2)}</td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>{u.totalChildren}</td>
                                    <td style={{ padding: '8px' }}>{u.parent?.username || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Loading users...</p>
                )}
            </div>
        </div>
    );
}
