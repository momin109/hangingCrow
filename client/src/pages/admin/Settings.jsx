import React from 'react';

export default function Settings() {
    const handleIconClick = (action) => {
        alert(`${action} functionality to be implemented`);
    };

    return (
        <div className="page">
            <h3 className="component-title" style={{ border: 'none' }}>Admin Settings</h3>

            <div className="settings-group">
                <div className="settings-group-title">General Settings</div>
                <div className="settings-icons">
                    <div className="icon-card purple card-bg-lightred" onClick={() => handleIconClick('Change Password')}>
                        <i>🔒</i> CHANGE PASSWORD
                    </div>
                    <div className="icon-card purple card-bg-lightyellow" onClick={() => handleIconClick('Search Users')}>
                        <i>👤</i> SEARCH USERS
                    </div>
                    <div className="icon-card yellow card-bg-lightgreen" onClick={() => handleIconClick('Surveillance')}>
                        <i>⚠️</i> SURVEILLANCE
                    </div>
                </div>
            </div>

            <div className="settings-group">
                <div className="settings-group-title">Match And Bets</div>
                <div className="settings-icons">
                    <div className="icon-card green card-bg-lightgreen" onClick={() => handleIconClick('Active Match List')}>
                        <i>✅</i> ACTIVE MATCH LIST
                    </div>
                    <div className="icon-card red card-bg-lightred" onClick={() => handleIconClick('Inactive Match List')}>
                        <i>❌</i> IN-ACTIVE MATCH LIST
                    </div>
                    <div className="icon-card yellow card-bg-lightyellow" onClick={() => handleIconClick('Update Fancy Status')}>
                        <i>📝</i> UPDATE FANCY STATUS
                    </div>
                    <div className="icon-card red card-bg-lightred" onClick={() => handleIconClick('Suspended Result')}>
                        <i>📋</i> SUSPENDED RESULT
                    </div>
                </div>
            </div>

            <div className="settings-group">
                <div className="settings-group-title">User Settings</div>
                <div className="settings-icons">
                    <div className="icon-card red card-bg-lightred" onClick={() => handleIconClick('Inactive Users')}>
                        <i>👥</i> IN-ACTIVE USERS
                    </div>
                    <div className="icon-card green card-bg-lightgreen" onClick={() => handleIconClick('Bet Locked Users')}>
                        <i>🔐</i> BET LOCKED USERS
                    </div>
                </div>
            </div>
        </div>
    );
}
