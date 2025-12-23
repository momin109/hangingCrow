/**
 * Design Token System
 * Dark + Light theme with CSS variables
 * Persists selection in localStorage
 */

export const themes = {
    light: {
        '--primary': 'hsl(180, 70%, 45%)',
        '--primary-hover': 'hsl(180, 70%, 38%)',
        '--danger': 'hsl(0, 75%, 55%)',
        '--danger-hover': 'hsl(0, 75%, 48%)',
        '--success': 'hsl(140, 65%, 45%)',
        '--success-hover': 'hsl(140, 65%, 38%)',
        '--surface': 'hsl(220, 15%, 98%)',
        '--surface-elevated': 'hsl(0, 0%, 100%)',
        '--border': 'hsl(220, 15%, 88%)',
        '--text-primary': 'hsl(220, 20%, 15%)',
        '--text-secondary': 'hsl(220, 10%, 45%)',
        '--text-disabled': 'hsl(220, 10%, 70%)',
        '--radius': '8px',
        '--shadow': '0 2px 8px rgba(0, 0, 0, 0.08)',
        '--shadow-lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
    },
    dark: {
        '--primary': 'hsl(180, 75%, 50%)',
        '--primary-hover': 'hsl(180, 75%, 60%)',
        '--danger': 'hsl(0, 70%, 60%)',
        '--danger-hover': 'hsl(0, 70%, 70%)',
        '--success': 'hsl(140, 60%, 50%)',
        '--success-hover': 'hsl(140, 60%, 60%)',
        '--surface': 'hsl(220, 30%, 10%)',
        '--surface-elevated': 'hsl(220, 28%, 14%)',
        '--border': 'hsl(220, 25%, 22%)',
        '--text-primary': 'hsl(220, 80%, 92%)',
        '--text-secondary': 'hsl(220, 20%, 65%)',
        '--text-disabled': 'hsl(220, 15%, 45%)',
        '--radius': '8px',
        '--shadow': '0 2px 8px rgba(0, 0, 0, 0.3)',
        '--shadow-lg': '0 8px 24px rgba(0, 0, 0, 0.5)',
    },
};

export const fonts = {
    '--font-en': "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    '--font-bn': "'Noto Sans Bengali', 'Hind Siliguri', sans-serif",
};

/**
 * Apply theme to document root
 */
export function applyTheme(mode = 'dark') {
    const root = document.documentElement;
    const theme = themes[mode] || themes.dark;

    Object.entries({ ...theme, ...fonts }).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });

    localStorage.setItem('themeMode', mode);
}

/**
 * Get current theme mode from localStorage
 */
export function getThemeMode() {
    return localStorage.getItem('themeMode') || 'dark';
}

/**
 * Toggle between dark and light theme
 */
export function toggleTheme() {
    const current = getThemeMode();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    return next;
}

/**
 * Initialize theme on app load
 */
export function initTheme() {
    const mode = getThemeMode();
    applyTheme(mode);
    return mode;
}
