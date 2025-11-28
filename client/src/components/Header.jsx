import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
    const { t, i18n } = useTranslation();
    const { user, logout, isAuthenticated } = useAuth();
    const nav = useNavigate();

    function setLang(l) {
        i18n.changeLanguage(l);
    }

    function handleLogout() {
        logout();
        nav('/login');
    }

    return (
        <header className="topbar">
            <div className="brand">{t('app_title')}</div>
            <div className="top-actions">
                {isAuthenticated && (
                    <span style={{ marginRight: '12px', color: '#22c1b6' }}>
                        {user?.username} ({user?.role})
                    </span>
                )}
                <select onChange={(e) => setLang(e.target.value)} defaultValue="en">
                    <option value="en">EN</option>
                    <option value="bn">BN</option>
                </select>
                {isAuthenticated ? (
                    <button onClick={handleLogout}>{t('logout')}</button>
                ) : (
                    <button onClick={() => nav('/login')}>{t('login')}</button>
                )}
            </div>
        </header>
    );
}
