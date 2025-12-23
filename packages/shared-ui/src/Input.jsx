import React from 'react';
import './Input.css';

/**
 * Accessible input component with label and validation states
 * WCAG 2.2 AA compliant
 */
export default function Input({
    id,
    label,
    type = 'text',
    value,
    onChange,
    onBlur,
    placeholder,
    disabled = false,
    required = false,
    error,
    helpText,
    className = '',
    inputMode,
    autoComplete,
    ...props
}) {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                    {required && <span className="input-required" aria-label="required">*</span>}
                </label>
            )}
            <input
                id={inputId}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                inputMode={inputMode}
                autoComplete={autoComplete}
                className={`input ${hasError ? 'input--error' : ''}`}
                aria-invalid={hasError}
                aria-describedby={
                    error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
                }
                {...props}
            />
            {error && (
                <div id={`${inputId}-error`} className="input-error" role="alert">
                    {error}
                </div>
            )}
            {helpText && !error && (
                <div id={`${inputId}-help`} className="input-help">
                    {helpText}
                </div>
            )}
        </div>
    );
}
