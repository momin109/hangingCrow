import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

/* Pages */
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/user/Dashboard";
import WalletPage from "./pages/user/Wallet";
import MyBetsPage from "./pages/user/MyBets";
import ProfilePage from "./pages/user/Profile";
import ReferralPage from "./pages/user/Referral";
import AgentDashboard from "./pages/agent/Dashboard";
import AgentClients from "./pages/agent/Clients";
import AgentWallet from "./pages/agent/Wallet";
import AgentDownline from "./pages/agent/Downline";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminAgents from "./pages/admin/Agents";
import AdminReports from "./pages/admin/Reports";
import MatchManagement from "./pages/admin/MatchManagement";
import Settings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";

export default function App() {
    return (
        <AuthProvider>
            <div className="app-root">
                <Header />
                <div className="layout">
                    <Sidebar />
                    <main className="content">
                        <Routes>
                            <Route path="/" element={<Navigate to="/login" replace />} />
                            <Route path="/login" element={<LoginPage />} />

                            {/* User Routes */}
                            <Route
                                path="/user/dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['USER', 'AGENT', 'MASTER_AGENT', 'SUPER_AGENT', 'ADMIN', 'B2C_SUBADMIN', 'B2B_SUBADMIN', 'SUPERADMIN', 'WHITELABEL', 'MOTHER', 'OWNER']}>
                                        <UserDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/user/wallet"
                                element={
                                    <ProtectedRoute>
                                        <WalletPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/user/my-bets"
                                element={
                                    <ProtectedRoute>
                                        <MyBetsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/user/profile"
                                element={
                                    <ProtectedRoute>
                                        <ProfilePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/user/referral"
                                element={
                                    <ProtectedRoute>
                                        <ReferralPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Agent Routes */}
                            <Route
                                path="/agent/dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['AGENT', 'MASTER_AGENT', 'SUPER_AGENT', 'ADMIN', 'B2C_SUBADMIN', 'B2B_SUBADMIN', 'SUPERADMIN', 'WHITELABEL', 'MOTHER', 'OWNER']}>
                                        <AgentDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/agent/clients"
                                element={
                                    <ProtectedRoute allowedRoles={['AGENT', 'MASTER_AGENT', 'SUPER_AGENT', 'ADMIN', 'B2C_SUBADMIN', 'B2B_SUBADMIN', 'SUPERADMIN', 'WHITELABEL', 'MOTHER', 'OWNER']}>
                                        <AgentClients />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/agent/wallet"
                                element={
                                    <ProtectedRoute allowedRoles={['AGENT', 'MASTER_AGENT', 'SUPER_AGENT', 'ADMIN', 'B2C_SUBADMIN', 'B2B_SUBADMIN', 'SUPERADMIN', 'WHITELABEL', 'MOTHER', 'OWNER']}>
                                        <AgentWallet />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/agent/downline"
                                element={
                                    <ProtectedRoute allowedRoles={['AGENT', 'MASTER_AGENT', 'SUPER_AGENT', 'ADMIN', 'B2C_SUBADMIN', 'B2B_SUBADMIN', 'SUPERADMIN', 'WHITELABEL', 'MOTHER', 'OWNER']}>
                                        <AgentDownline />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Admin Routes */}
                            <Route
                                path="/admin/dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['ADMIN', 'B2C_SUBADMIN', 'B2B_SUBADMIN', 'SUPERADMIN', 'WHITELABEL', 'MOTHER', 'OWNER']}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/users"
                                element={
                                    <ProtectedRoute allowedRoles={['ADMIN', 'B2C_SUBADMIN', 'B2B_SUBADMIN', 'SUPERADMIN', 'WHITELABEL', 'MOTHER', 'OWNER']}>
                                        <AdminUsers />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/agents"
                                element={
                                    <ProtectedRoute allowedRoles={['ADMIN', 'B2C_SUBADMIN', 'B2B_SUBADMIN', 'SUPERADMIN', 'WHITELABEL', 'MOTHER', 'OWNER']}>
                                        <AdminAgents />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/reports"
                                element={
                                    <ProtectedRoute allowedRoles={['ADMIN', 'B2C_SUBADMIN', 'B2B_SUBADMIN', 'SUPERADMIN', 'WHITELABEL', 'MOTHER', 'OWNER']}>
                                        <AdminReports />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/matches"
                                element={
                                    <ProtectedRoute allowedRoles={['ADMIN', 'B2C_SUBADMIN', 'B2B_SUBADMIN', 'SUPERADMIN', 'WHITELABEL', 'MOTHER', 'OWNER']}>
                                        <MatchManagement />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/settings"
                                element={
                                    <ProtectedRoute allowedRoles={['ADMIN', 'B2C_SUBADMIN', 'B2B_SUBADMIN', 'SUPERADMIN', 'WHITELABEL', 'MOTHER', 'OWNER']}>
                                        <Settings />
                                    </ProtectedRoute>
                                }
                            />

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </AuthProvider>
    );
}
