/**
 * VEIKI Theme Configuration
 * Dark theme with neon pink accent (#FF007F)
 */

export const VEIKI_THEME = {
    colors: {
        // Primary Colors
        primary: '#FF007F',      // Neon Pink
        primaryHover: '#FF339F',
        primaryLight: 'rgba(255, 0, 127, 0.1)',

        // Secondary Colors
        secondary: '#00D9FF',    // Cyan accent
        secondaryHover: '#33E0FF',

        // Background Colors
        background: '#0A0A0A',   // Pure dark
        backgroundAlt: '#050505',
        surface: '#1A1A1A',      // Card background
        surfaceHover: '#252525', // Hover state
        surfaceActive: '#2F2F2F',

        // Text Colors
        text: '#FFFFFF',         // Primary text
        textSecondary: '#CCCCCC',
        textMuted: '#999999',    // Secondary text
        textDisabled: '#666666',

        // Status Colors
        success: '#00FF88',      // Green
        successBg: 'rgba(0, 255, 136, 0.1)',
        danger: '#FF3366',       // Red
        dangerBg: 'rgba(255, 51, 102, 0.1)',
        warning: '#FFB800',      // Yellow
        warningBg: 'rgba(255, 184, 0, 0.1)',
        info: '#00D9FF',
        infoBg: 'rgba(0, 217, 255, 0.1)',

        // UI Elements
        border: '#333333',       // Subtle borders
        borderHover: '#444444',
        divider: '#222222',

        // Overlay
        overlay: 'rgba(0, 0, 0, 0.8)',
        modalBackdrop: 'rgba(0, 0, 0, 0.9)',
    },

    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
    },

    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
    },

    fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem',// 30px
        '4xl': '2.25rem', // 36px
    },

    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },

    shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
        md: '0 4px 6px rgba(0, 0, 0, 0.4)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.3)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.3)',
        glow: '0 0 20px rgba(255, 0, 127, 0.5)',
        glowStrong: '0 0 30px rgba(255, 0, 127, 0.7)',
    },

    transitions: {
        fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
        normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
        slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
    },

    zIndex: {
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modalBackdrop: 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
    },
};

// Export as default for easy import
export default VEIKI_THEME;
