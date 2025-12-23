import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import WalletPage from './pages/WalletPage';
import BetsPage from './pages/BetsPage';
import KYCPage from './pages/KYCPage';
import Layout from './components/Layout';
import Spinner from './components/Spinner';

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <Spinner overlay size="large" />;
    }

    return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/wallet" replace /> : <LoginPage />} />

            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Layout />
                    </PrivateRoute>
                }
            >
                <Route index element={<Navigate to="/wallet" replace />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="bets" element={<BetsPage />} />
                <Route path="kyc" element={<KYCPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
