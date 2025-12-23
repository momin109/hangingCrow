import React from 'react';
import './Select.css';

/**
 * Accessible select dropdown with keyboard navigation
 * WCAG 2.2 AA compliant
 */
export default function Select({
    id,
    label,
    value,
    onChange,
    options = [],
    disabled = false,
    required = false,
    error,
    placeholder = 'Select an option',
    className = '',
    ...props
}) {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    return (
        <div className={`select-wrapper ${className}`}>
            {label && (
                <label htmlFor={selectId} className="select-label">
                    {label}
                    {required && <span className="select-required" aria-label="required">*</span>}
                </label>
            )}
            <div className="select-container">
                <select
                    id={selectId}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    className={`select ${hasError ? 'select--error' : ''}`}
                    aria-invalid={hasError}
                    aria-describedby={error ? `${selectId}-error` : undefined}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <span className="select-arrow" aria-hidden="true">▾</span>
            </div>
            {error && (
                <div id={`${selectId}-error`} className="select-error" role="alert">
                    {error}
                </div>
            )}
        </div>
    );
}
