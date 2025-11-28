import React from "react";

export default function AdminDashboard() {
    return (
        <div className="page">
            <h2>Admin Dashboard</h2>

            <div className="card">
                <h4>Platform Stats</h4>
                <p>Total Users: <b>4,200</b> (demo)</p>
                <p>Total Agents: <b>350</b> (demo)</p>
                <p>Active Bets: <b>1,245</b> (demo)</p>
                <p>Total GGR: <b>৳ 120,000.00</b> (demo)</p>
            </div>

            <div className="card">
                <h4>Recent Activity</h4>
                <div style={{ color: '#9fb0c8' }}>No recent activity (demo)</div>
            </div>
        </div>
    );
}
