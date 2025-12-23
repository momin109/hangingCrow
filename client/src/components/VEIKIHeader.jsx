import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function VEIKIHeader() {
    const { user, balance, refreshBalance } = useAuth();

    const handleRefresh = () => {
        refreshBalance();
    };

    return (
        <div className="veiki-header">
            <div className="logo">
                <span className="logo-icon">V</span>
                <span className="com">.com</span>
                <span className="logo-text">sami-vai</span>
            </div>
            <div className="user-info">
                <span className="role">{user?.role?.toLowerCase() || 'user'}</span>
                <span className="name">{user?.username || 'Guest'}</span>
                <span className="main-balance">Main</span>
                <span className="main-balance">BDT {balance?.toFixed(2) || '0.00'}</span>
                <span className="refresh" onClick={handleRefresh} title="Refresh Balance">⟳</span>
            </div>
        </div>
    );
}
