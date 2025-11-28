import React from "react";

export default function AgentDashboard() {
    return (
        <div className="page">
            <h2>Agent Dashboard</h2>

            <div className="card">
                <h4>Agent Stats</h4>
                <p>Total Clients: <b>120</b> (demo)</p>
                <p>Active Bets: <b>45</b> (demo)</p>
                <p>Total Commission: <b>৳ 4,200.00</b> (demo)</p>
            </div>

            <div className="card">
                <h4>Recent Activity</h4>
                <div style={{ color: '#9fb0c8' }}>No recent activity (demo)</div>
            </div>
        </div>
    );
}
