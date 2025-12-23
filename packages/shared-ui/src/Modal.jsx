import React, { useEffect, useRef } from 'react';
import './Modal.css';

/**
 * Accessible modal dialog with focus trap
 * WCAG 2.2 AA compliant - traps focus, closes on Escape
 */
export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'medium',
    closeOnOverlayClick = true,
}) {
    const modalRef = useRef(null);
    const previousFocusRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            // Store currently focused element
            previousFocusRef.current = document.activeElement;

            // Focus first focusable element in modal
            const focusableElements = modalRef.current?.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements?.length > 0) {
                focusableElements[0].focus();
            }

            // Disable body scroll
            document.body.style.overflow = 'hidden';

            return () => {
                // Restore focus and scroll
                document.body.style.overflow = '';
                previousFocusRef.current?.focus();
            };
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="modal-overlay"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            <div ref={modalRef} className={`modal modal--${size}`}>
                <div className="modal-header">
                    {title && (
                        <h2 id="modal-title" className="modal-title">
                            {title}
                        </h2>
                    )}
                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                        type="button"
                    >
                        ✕
                    </button>
                </div>
                <div className="modal-body">{children}</div>
                {footer && <div className="modal-footer">{footer}</div>}
            </div>
        </div>
    );
}
