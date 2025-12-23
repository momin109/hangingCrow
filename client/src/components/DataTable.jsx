import React, { useState } from 'react';
import VEIKI_THEME from '../theme.config';

/**
 * Production-Ready DataTable Component
 * Dense layout matching VEIKI screenshots
 */
export default function DataTable({
    columns,
    data,
    onAction,
    pagination = true,
    pageSize: initialPageSize = 20,
    loading = false,
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    // Handle sorting
    const handleSort = (column) => {
        if (!column.sortable) return;

        if (sortColumn === column.key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column.key);
            setSortDirection('asc');
        }
    };

    // Sort data
    const sortedData = React.useMemo(() => {
        if (!sortColumn) return data;

        return [...data].sort((a, b) => {
            const aVal = a[sortColumn];
            const bVal = b[sortColumn];

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortColumn, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = pagination
        ? sortedData.slice(startIndex, startIndex + pageSize)
        : sortedData;

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner} />
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead style={styles.thead}>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    style={{
                                        ...styles.th,
                                        cursor: column.sortable ? 'pointer' : 'default',
                                        textAlign: column.align || 'left',
                                    }}
                                    onClick={() => handleSort(column)}
                                >
                                    <div style={styles.thContent}>
                                        {column.label}
                                        {column.sortable && sortColumn === column.key && (
                                            <span style={styles.sortIcon}>
                                                {sortDirection === 'asc' ? ' ▲' : ' ▼'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                style={styles.tr}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = VEIKI_THEME.colors.surfaceHover;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        style={{
                                            ...styles.td,
                                            textAlign: column.align || 'left',
                                        }}
                                    >
                                        {column.render
                                            ? column.render(row[column.key], row, onAction)
                                            : row[column.key]
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination && totalPages > 1 && (
                <div style={styles.pagination}>
                    <div style={styles.paginationInfo}>
                        Showing {startIndex + 1}-{Math.min(startIndex + pageSize, sortedData.length)} of {sortedData.length}
                    </div>

                    <div style={styles.paginationControls}>
                        <button
                            style={styles.pageButton}
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            ⏮ First
                        </button>
                        <button
                            style={styles.pageButton}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            ◀ Prev
                        </button>

                        <span style={styles.pageIndicator}>
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            style={styles.pageButton}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next ▶
                        </button>
                        <button
                            style={styles.pageButton}
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            Last ⏭
                        </button>
                    </div>

                    <select
                        style={styles.pageSizeSelect}
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={10}>10 / page</option>
                        <option value={20}>20 / page</option>
                        <option value={50}>50 / page</option>
                        <option value={100}>100 / page</option>
                    </select>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: VEIKI_THEME.colors.surface,
        borderRadius: VEIKI_THEME.borderRadius.md,
        border: `1px solid ${VEIKI_THEME.colors.border}`,
        overflow: 'hidden',
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    thead: {
        backgroundColor: VEIKI_THEME.colors.surfaceActive,
        borderBottom: `2px solid ${VEIKI_THEME.colors.primary}`,
    },
    th: {
        padding: '10px 16px',
        fontSize: VEIKI_THEME.fontSize.sm,
        fontWeight: VEIKI_THEME.fontWeight.semibold,
        color: VEIKI_THEME.colors.text,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        whiteSpace: 'nowrap',
    },
    thContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    sortIcon: {
        fontSize: '10px',
        color: VEIKI_THEME.colors.primary,
    },
    tr: {
        borderBottom: `1px solid ${VEIKI_THEME.colors.divider}`,
        transition: `background-color ${VEIKI_THEME.transitions.fast}`,
    },
    td: {
        padding: '12px 16px',
        fontSize: VEIKI_THEME.fontSize.sm,
        color: VEIKI_THEME.colors.textSecondary,
    },
    pagination: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderTop: `1px solid ${VEIKI_THEME.colors.border}`,
        backgroundColor: VEIKI_THEME.colors.backgroundAlt,
    },
    paginationInfo: {
        fontSize: VEIKI_THEME.fontSize.sm,
        color: VEIKI_THEME.colors.textMuted,
    },
    paginationControls: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
    },
    pageButton: {
        padding: '6px 12px',
        fontSize: VEIKI_THEME.fontSize.sm,
        backgroundColor: VEIKI_THEME.colors.surface,
        color: VEIKI_THEME.colors.text,
        border: `1px solid ${VEIKI_THEME.colors.border}`,
        borderRadius: VEIKI_THEME.borderRadius.sm,
        cursor: 'pointer',
        transition: `all ${VEIKI_THEME.transitions.fast}`,
    },
    pageIndicator: {
        padding: '0 12px',
        fontSize: VEIKI_THEME.fontSize.sm,
        color: VEIKI_THEME.colors.text,
        fontWeight: VEIKI_THEME.fontWeight.medium,
    },
    pageSizeSelect: {
        padding: '6px 12px',
        fontSize: VEIKI_THEME.fontSize.sm,
        backgroundColor: VEIKI_THEME.colors.surface,
        color: VEIKI_THEME.colors.text,
        border: `1px solid ${VEIKI_THEME.colors.border}`,
        borderRadius: VEIKI_THEME.borderRadius.sm,
        cursor: 'pointer',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        color: VEIKI_THEME.colors.textMuted,
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: `4px solid ${VEIKI_THEME.colors.border}`,
        borderTop: `4px solid ${VEIKI_THEME.colors.primary}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
};
