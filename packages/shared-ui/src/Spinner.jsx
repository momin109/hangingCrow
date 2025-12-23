import React from 'react';
import './Spinner.css';

/**
 * Loading spinner component
 */
export default function Spinner({ size = 'medium', overlay = false }) {
    const spinner = (
        <div className={`spinner spinner--${size}`} role="status" aria-live="polite">
            <span className="sr-only">Loading...</span>
        </div>
    );

    if (overlay) {
        return <div className="spinner-overlay">{spinner}</div>;
    }

    return spinner;
}
