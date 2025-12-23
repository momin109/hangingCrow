import React, { useState } from 'react';
import VEIKI_THEME from '../theme.config';

/**
 * Status Toggle Component
 * VEIKI-styled switch for Active/Inactive status
 */
export default function StatusToggle({ status, onChange, disabled = false, labels = { active: 'Active', inactive: 'Inactive' } }) {
    const [isChanging, setIsChanging] = useState(false);

    const handleToggle = async () => {
        if (disabled || isChanging) return;

        setIsChanging(true);
        try {
            await onChange(!status);
        } finally {
            setIsChanging(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={disabled || isChanging}
            style={{
                ...styles.toggle,
                backgroundColor: status ? VEIKI_THEME.colors.success : VEIKI_THEME.colors.danger,
                opacity: disabled ? 0.5 : 1,
                cursor: disabled || isChanging ? 'not-allowed' : 'pointer',
            }}
        >
            <div
                style={{
                    ...styles.slider,
                    transform: status ? 'translateX(22px)' : 'translateX(2px)',
                }}
            />
            <span style={{
                ...styles.label,
                paddingLeft: status ? '8px' : '28px',
            }}>
                {isChanging ? '...' : (status ? labels.active : labels.inactive)}
            </span>
        </button>
    );
}

const styles = {
    toggle: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: '100px',
        height: '32px',
        borderRadius: VEIKI_THEME.borderRadius.full,
        border: 'none',
        transition: `all ${VEIKI_THEME.transitions.normal}`,
        fontWeight: VEIKI_THEME.fontWeight.semibold,
        fontSize: VEIKI_THEME.fontSize.xs,
    },
    slider: {
        position: 'absolute',
        width: '26px',
        height: '26px',
        borderRadius: '50%',
        backgroundColor: VEIKI_THEME.colors.text,
        transition: `transform ${VEIKI_THEME.transitions.normal}`,
        boxShadow: VEIKI_THEME.shadows.md,
    },
    label: {
        color: VEIKI_THEME.colors.text,
        transition: `padding ${VEIKI_THEME.transitions.normal}`,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
};
