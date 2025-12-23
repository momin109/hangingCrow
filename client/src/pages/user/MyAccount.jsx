import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function MyAccount() {
    const { user, balance } = useAuth();
    const [activeTab, setActiveTab] = useState('summary');

    const renderContent = () => {
        switch (activeTab) {
            case 'position':
                return (
                    <>
                        <h3 style={{ border: 'none' }}>Position</h3>
                        <div className="info-text">No active positions</div>
                    </>
                );
            case 'statement':
                return (
                    <>
                        <h3 style={{ border: 'none' }}>Account Statement</h3>
                        <div className="info-text">No transactions</div>
                    </>
                );
            case 'summary':
                return (
                    <>
                        <h3 style={{ border: 'none' }}>Account Summary</h3>
                        <div className="summary-value">{balance?.toFixed(2) || '0.00'} <span className="summary-label">BDT</span></div>
                        <div style={{ marginTop: '20px', color: '#555' }}>Total Balance</div>
                    </>
                );
            case 'details':
                return (
                    <>
                        <h3 style={{ border: 'none' }}>Account Details</h3>
                        <div className="info-text">
                            <p><strong>Username:</strong> {user?.username}</p>
                            <p><strong>Role:</strong> {user?.role}</p>
                            <p><strong>Status:</strong> Active</p>
                        </div>
                    </>
                );
            case 'profile':
                return (
                    <>
                        <h3 style={{ border: 'none' }}>Profile</h3>
                        <div className="info-text">
                            <p><strong>Name:</strong> {user?.username}</p>
                            <p><strong>Email:</strong> {user?.email || 'Not set'}</p>
                        </div>
                    </>
                );
            case 'activity':
                return (
                    <>
                        <h3 style={{ border: 'none' }}>Activity Log</h3>
                        <div className="info-text">No recent activity</div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="page">
            <div className="account-layout">
                <div className="sidebar">
                    <div className="sidebar-header">
                        {user?.role?.substring(0, 3).toUpperCase()} {user?.username}
                    </div>
                    <div
                        className={`sidebar-item ${activeTab === 'position' ? 'active' : ''}`}
                        onClick={() => setActiveTab('position')}
                    >
                        Position
                    </div>
                    <div
                        className={`sidebar-item ${activeTab === 'statement' ? 'active' : ''}`}
                        onClick={() => setActiveTab('statement')}
                    >
                        Account Statement
                    </div>
                    <div
                        className={`sidebar-item ${activeTab === 'summary' ? 'active' : ''}`}
                        onClick={() => setActiveTab('summary')}
                    >
                        Account Summary
                    </div>
                    <div
                        className={`sidebar-item ${activeTab === 'details' ? 'active' : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Account Details
                    </div>
                    <div
                        className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </div>
                    <div
                        className={`sidebar-item ${activeTab === 'activity' ? 'active' : ''}`}
                        onClick={() => setActiveTab('activity')}
                        style={{ borderBottom: 'none' }}
                    >
                        Activity Log
                    </div>
                </div>
                <div className="main-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
