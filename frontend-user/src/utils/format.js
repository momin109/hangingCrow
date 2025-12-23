/**
 * Format number for Bengali (bn-BD) or English locale
 */
export function formatNumber(value, locale = 'en') {
    const num = parseFloat(value);
    if (isNaN(num)) return '0';

    if (locale === 'bn') {
        return new Intl.NumberFormat('bn-BD', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(num);
    }

    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(num);
}

/**
 * Format currency with symbol
 */
export function formatCurrency(value, locale = 'en') {
    const formatted = formatNumber(value, locale);
    return locale === 'bn' ? `৳ ${formatted}` : `৳${formatted}`;
}

/**
 * Format date and time based on locale
 */
export function formatDateTime(date, locale = 'en') {
    const d = new Date(date);

    if (locale === 'bn') {
        return new Intl.DateTimeFormat('bn-BD', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(d);
    }

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(d);
}
