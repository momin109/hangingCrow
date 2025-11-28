import React from "react";

export default function AdminReports() {
    return (
        <div className="page">
            <h2>Reports</h2>

            <div className="card">
                <h4>Export Reports</h4>
                <button>Export Users CSV</button>&nbsp;
                <button>Export Bets CSV</button>&nbsp;
                <button>Export Transactions CSV</button>
            </div>

            <div className="card">
                <h4>Analytics</h4>
                <div style={{ color: '#9fb0c8' }}>Analytics dashboard coming soon (demo)</div>
            </div>
        </div>
    );
}
