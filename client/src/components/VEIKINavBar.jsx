import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function VEIKINavBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    // Get current timezone
    const getTimezone = () => {
        const offset = -new Date().getTimezoneOffset() / 60;
        return `GMT${offset >= 0 ? '+' : ''}${offset}`;
    };

    // Check if user has admin/agent roles
    const isAdminOrAgent = () => {
        const adminRoles = ['ADMIN', 'B2C_SUBADMIN', 'B2B_SUBADMIN', 'SUPERADMIN', 'WHITELABEL', 'MOTHER', 'OWNER'];
        const agentRoles = ['AGENT', 'MASTER_AGENT', 'SUPER_AGENT', 'AFFILIATE', 'SENIOR_AFFILIATE'];
        return adminRoles.includes(user?.role) || agentRoles.includes(user?.role);
    };

    return (
        <div className="nav-bar">
            {isAdminOrAgent() && (
                <NavLink
                    to="/admin/downline"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    Downline List
                </NavLink>
            )}

            <NavLink
                to="/user/account"
                className={({ isActive }) => `nav-item has-dropdown ${isActive ? 'active' : ''}`}
            >
                My Account
            </NavLink>

            <div className="nav-item has-dropdown">My Report</div>

            <NavLink
                to="/admin/bet-list"
                className={({ isActive }) => `nav-item has-dropdown ${isActive ? 'active' : ''}`}
            >
                BetList
            </NavLink>

            <NavLink
                to="/admin/bet-list-live"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                BetListLive
            </NavLink>

            {isAdminOrAgent() && (
                <>
                    <NavLink
                        to="/admin/risk-management"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        Risk Management
                    </NavLink>

                    <NavLink
                        to="/admin/banking"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        Banking
                    </NavLink>

                    <NavLink
                        to="/admin/sport-listing"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        Block Market
                    </NavLink>

                    <NavLink
                        to="/admin/settings"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        Admin Setting
                    </NavLink>
                </>
            )}

            <div className="nav-item">Result</div>

            <div className="nav-right">
                <span className="time-zone">Time Zone : {getTimezone()}</span>
                <a href="#" className="logout" onClick={handleLogout}>Logout</a>
                <span className="refresh" onClick={handleRefresh} title="Refresh Page">⟳</span>
            </div>
        </div>
    );
}
