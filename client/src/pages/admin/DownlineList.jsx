import React, { useState, useEffect } from 'react';
import NewsBar from '../../components/NewsBar';
import FilterSection from '../../components/FilterSection';
import BalanceCards from '../../components/BalanceCards';
import DataTable from '../../components/DataTable';
import { userAPI } from '../../services/api';

export default function DownlineList() {
    const [searchValue, setSearchValue] = useState('');
    const [statusValue, setStatusValue] = useState('active');
    const [downlineUsers, setDownlineUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [balances, setBalances] = useState([
        { label: 'Total Balance', value: 0, currency: 'BDT', isExposure: false },
        { label: 'Total Exposure', value: 0, currency: 'BDT', isExposure: true },
        { label: 'Total Avail. bal.', value: 0, currency: 'BDT', isExposure: false },
        { label: 'Balance', value: 0, currency: 'BDT', isExposure: false },
        { label: 'Available Balance', value: 0, currency: 'BDT', isExposure: false },
        { label: 'Total Player Balance', value: 0, currency: 'BDT', isExposure: false },
    ]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await userAPI.search(searchValue);
            setDownlineUsers(response.data || []);
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSenior = () => {
        // TODO: Open modal for adding senior
        alert('Add Senior functionality to be implemented');
    };

    const handleRefresh = () => {
        setSearchValue('');
        setDownlineUsers([]);
    };

    const tableHeaders = [
        { label: 'Sr. No.', key: 'id', style: { flex: '0 0 50px' } },
        { label: 'Account', key: 'username', style: { flex: 2 } },
        { label: 'Credit Ref.', key: 'creditRef', style: { flex: 1 } },
        { label: 'Balance', key: 'balance', style: { flex: 1 }, render: (row) => `BDT ${row.balance || 0}` },
        { label: 'Player Exposure', key: 'exposure', style: { flex: 1 }, render: (row) => `BDT ${row.exposure || 0}` },
        { label: 'Avail. bal.', key: 'availableBalance', style: { flex: 1 }, render: (row) => `BDT ${(row.balance || 0) - (row.exposure || 0)}` },
        { label: 'Player Balance', key: 'playerBalance', style: { flex: 1 }, render: (row) => `BDT ${row.playerBalance || 0}` },
        { label: 'Reference P/L', key: 'referencePL', style: { flex: 1 }, render: (row) => `BDT ${row.referencePL || 0}` },
        { label: 'Status', key: 'status', style: { flex: 1 }, render: (row) => row.status || 'Active' },
        { label: 'Action', key: 'action', style: { flex: 1 }, render: (row) => <button>View</button> },
    ];

    return (
        <div className="page">
            <NewsBar />

            <FilterSection
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onSearch={handleSearch}
                statusValue={statusValue}
                onStatusChange={setStatusValue}
                onAddSenior={handleAddSenior}
                onRefresh={handleRefresh}
            />

            <BalanceCards balances={balances} />

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <DataTable
                    headers={tableHeaders}
                    data={downlineUsers}
                    emptyMessage="No records found"
                />
            )}
        </div>
    );
}
