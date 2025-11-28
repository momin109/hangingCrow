import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

export default function UserDashboard() {
    const { user } = useAuth();
    const [wallet, setWallet] = useState(null);

    useEffect(() => {
        loadWallet();
    }, []);

    async function loadWallet() {
        try {
            const res = await axios.get(`/api/users/${user.id}`);
            setWallet(res.data.wallet);
        } catch (e) {
            console.error('Failed to load wallet', e);
        }
    }

    return (
        <div className="page">
            <h2>User Dashboard</h2>
            <div className="card">
                <h3>Welcome, {user?.username}!</h3>
                <p>Role: <b>{user?.role}</b></p>
            </div>

            <div className="card">
                <h4>Balance</h4>
                {wallet ? (
                    <div>
                        <p style={{ fontSize: '24px', color: '#22c1b6', margin: 0 }}>
                            ৳ {parseFloat(wallet.balance || 0).toFixed(2)}
                        </p>
                        {wallet.commissionBalance > 0 && (
                            <small style={{ color: '#9fb0c8' }}>
                                Commission: ৳ {parseFloat(wallet.commissionBalance || 0).toFixed(2)}
                            </small>
                        )}
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>

            <div className="card">
                <h4>Quick Actions</h4>
                <button onClick={() => window.location.href = '/user/wallet'}>Deposit</button>&nbsp;
                <button onClick={() => window.location.href = '/user/wallet'}>Withdraw</button>&nbsp;
                <button onClick={() => window.location.href = '/user/my-bets'}>Place Bet</button>
            </div>
        </div>
    );
}
