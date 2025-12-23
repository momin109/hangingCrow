import React from 'react';

export default function FilterSection({
    searchValue,
    onSearchChange,
    onSearch,
    statusValue,
    onStatusChange,
    onAddSenior,
    onRefresh
}) {
    return (
        <div className="filter-section">
            <input
                type="text"
                placeholder="Find member..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
            />
            <button className="search" onClick={onSearch}>Search</button>

            <select value={statusValue} onChange={(e) => onStatusChange(e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="all">All</option>
            </select>

            {onAddSenior && (
                <button className="add-senior" onClick={onAddSenior}>
                    👤+ Add Senior
                </button>
            )}

            {onRefresh && (
                <span className="refresh-icon" onClick={onRefresh}>⟳</span>
            )}
        </div>
    );
}
