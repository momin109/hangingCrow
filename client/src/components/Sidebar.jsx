import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
    const { t } = useTranslation();
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) return null;

    const isAgent = ['AGENT', 'MASTER_AGENT', 'SUPER_AGENT', 'ADMIN', 'B2C_SUBADMIN', 'B2B_SUBADMIN', 'SUPERADMIN', 'WHITELABEL', 'MOTHER', 'OWNER'].includes(user?.role);
    const isAdmin = ['ADMIN', 'B2C_SUBADMIN', 'B2B_SUBADMIN', 'SUPERADMIN', 'WHITELABEL', 'MOTHER', 'OWNER'].includes(user?.role);

    return (
        <aside className="sidebar">
            <nav>
                <div className="nav-section">User</div>
                <NavLink to="/user/dashboard">{t('dashboard')}</NavLink>
                <NavLink to="/user/wallet">{t('wallet')}</NavLink>
                <NavLink to="/user/my-bets">{t('my_bets')}</NavLink>
                <NavLink to="/user/profile">{t('profile')}</NavLink>
                <NavLink to="/user/referral">{t('referral')}</NavLink>

                {isAgent && (
                    <>
                        <div className="nav-section">{t('agent')}</div>
                        <NavLink to="/agent/dashboard">Agent Dashboard</NavLink>
                        <NavLink to="/agent/clients">{t('clients')}</NavLink>
                        <NavLink to="/agent/wallet">Agent Wallet</NavLink>
                        <NavLink to="/agent/downline">{t('downline')}</NavLink>
                    </>
                )}

                {isAdmin && (
                    <>
                        <div className="nav-section">{t('admin')}</div>
                        <NavLink to="/admin/dashboard">Admin Dashboard</NavLink>
                        <NavLink to="/admin/users">{t('users')}</NavLink>
                        <NavLink to="/admin/agents">{t('agents')}</NavLink>
                        <NavLink to="/admin/reports">{t('reports')}</NavLink>
                        <NavLink to="/admin/matches">Matches</NavLink>
                        <NavLink to="/admin/settings">Settings</NavLink>
                    </>
                )}
            </nav>
        </aside>
    );
}
