import React from 'react';
import './Table.css';

/**
 * Responsive data table component
 * WCAG 2.2 AA compliant with proper semantic HTML
 */
export default function Table({
    columns = [],
    data = [],
    onRowClick,
    emptyMessage = 'No data available',
    className = '',
}) {
    return (
        <div className={`table-container ${className}`}>
            <table className="table" role="table">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index} scope="col" className="table-header">
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="table-empty">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={onRowClick ? 'table-row--clickable' : ''}
                                onClick={() => onRowClick?.(row)}
                                role={onRowClick ? 'button' : undefined}
                                tabIndex={onRowClick ? 0 : undefined}
                                onKeyDown={(e) => {
                                    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                                        e.preventDefault();
                                        onRowClick(row);
                                    }
                                }}
                            >
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="table-cell" data-label={column.header}>
                                        {column.render ? column.render(row) : row[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
