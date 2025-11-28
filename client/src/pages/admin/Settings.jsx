import React, { useState } from "react";

export default function Settings() {
    const [settings, setSettings] = useState({
        whatsapp: '+8801700000000',
        telegram: 'https://t.me/betting_support',
        email: 'support@betting.com',
        showWhatsapp: true,
        showTelegram: true,
        showEmail: true
    });

    const handleChange = (field, value) => {
        setSettings({ ...settings, [field]: value });
    };

    return (
        <div className="page">
            <h2>General Settings</h2>

            <div className="card" style={{ marginBottom: '20px' }}>
                <h4>Quick Access</h4>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center', padding: '20px', background: '#0b1726', borderRadius: '8px', minWidth: '120px' }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
                        <div>Deposit Chips</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '20px', background: '#0b1726', borderRadius: '8px', minWidth: '120px' }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏷️</div>
                        <div>Whitelabel Limit</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '20px', background: '#0b1726', borderRadius: '8px', minWidth: '120px' }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚙️</div>
                        <div>Website Setting</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '20px', background: '#0b1726', borderRadius: '8px', minWidth: '120px' }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏏</div>
                        <div>Sports Market</div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h4>Contact Settings</h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
                    <div>
                        <label>WhatsApp Number</label>
                        <input
                            value={settings.whatsapp}
                            onChange={e => handleChange('whatsapp', e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <label>Show</label><br />
                        <input
                            type="checkbox"
                            checked={settings.showWhatsapp}
                            onChange={e => handleChange('showWhatsapp', e.target.checked)}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
                    <div>
                        <label>Telegram Link</label>
                        <input
                            value={settings.telegram}
                            onChange={e => handleChange('telegram', e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <label>Show</label><br />
                        <input
                            type="checkbox"
                            checked={settings.showTelegram}
                            onChange={e => handleChange('showTelegram', e.target.checked)}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
                    <div>
                        <label>Support Email</label>
                        <input
                            value={settings.email}
                            onChange={e => handleChange('email', e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <label>Show</label><br />
                        <input
                            type="checkbox"
                            checked={settings.showEmail}
                            onChange={e => handleChange('showEmail', e.target.checked)}
                        />
                    </div>
                </div>

                <button>Save Settings</button>
            </div>
        </div>
    );
}
