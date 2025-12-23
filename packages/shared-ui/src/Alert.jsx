import React, { useEffect } from 'react';
import './Alert.css';

/**
 * Alert/Toast notification component
 * WCAG 2.2 AA compliant with role="alert" for announcements
 */
export default function Alert({
    type = 'info',
    message,
    onClose,
    autoClose = false,
    duration = 5000,
}) {
    useEffect(() => {
        if (autoClose && onClose) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, onClose]);

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
    };

    return (
        <div className={`alert alert--${type}`} role="alert" aria-live="polite">
            <span className="alert__icon" aria-hidden="true">
                {icons[type]}
            </span>
            <span className="alert__message">{message}</span>
            {onClose && (
                <button
                    className="alert__close"
                    onClick={onClose}
                    aria-label="Close alert"
                    type="button"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
