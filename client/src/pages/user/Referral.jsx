import React from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function Referral() {
    const { user } = useAuth();
    const code = `REF_${user?.username?.toUpperCase() || 'USER'}`;
    const link = `${window.location.origin}/register?ref=${code}`;

    return (
        <div className="page">
            <h2>Referral Program</h2>

            <div className="card">
                <h4>Your Referral Code</h4>
                <p style={{ fontSize: '20px', color: '#22c1b6' }}><b>{code}</b></p>
            </div>

            <div className="card">
                <h4>Referral Link</h4>
                <input
                    readOnly
                    value={link}
                    style={{ width: '100%', padding: '8px' }}
                    onClick={e => e.target.select()}
                />
                <br /><br />
                <button onClick={() => navigator.clipboard.writeText(link)}>
                    Copy Link
                </button>
            </div>

            <div className="card">
                <h4>Referral Stats</h4>
                <p>Total Referrals: <b>0</b> (demo)</p>
                <p>Total Earnings: <b>৳ 0.00</b> (demo)</p>
            </div>
        </div>
    );
}
