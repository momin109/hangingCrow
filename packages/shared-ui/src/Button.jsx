import React from 'react';
import './Button.css';

/**
 * Accessible button component
 * WCAG 2.2 AA compliant with keyboard navigation
 */
export default function Button({
    children,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    type = 'button',
    onClick,
    ariaLabel,
    className = '',
    fullWidth = false,
    ...props
}) {
    const classes = [
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        disabled && 'btn--disabled',
        loading && 'btn--loading',
        fullWidth && 'btn--full-width',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
            aria-busy={loading}
            {...props}
        >
            {loading ? (
                <>
                    <span className="btn__spinner" aria-hidden="true"></span>
                    <span className="btn__text">{children}</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}
