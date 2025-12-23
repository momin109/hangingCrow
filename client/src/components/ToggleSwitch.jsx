import React from 'react';

export default function ToggleSwitch({ checked, onChange, label }) {
    return (
        <label className="toggle-switch">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span className="slider"></span>
        </label>
    );
}
