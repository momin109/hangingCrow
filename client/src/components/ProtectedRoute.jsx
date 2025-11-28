import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <div className="page">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return (
            <div className="page">
                <div className="card" style={{ color: '#e74c3c' }}>
                    <h3>Access Denied</h3>
                    <p>You do not have permission to access this page.</p>
                    <p>Your role: <b>{user?.role}</b></p>
                    <p>Required roles: <b>{allowedRoles.join(', ')}</b></p>
                </div>
            </div>
        );
    }

    return children;
}
