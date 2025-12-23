import React, { useState, useEffect } from 'react';
import { bankingAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function Banking() {
    const { balance } = useAuth();
    const [searchValue, setSearchValue] = useState('');
    const [statusValue, setStatusValue] = useState('active');
    const [bankingData, setBankingData] = useState([]);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBankingData();
    }, []);

    const fetchBankingData = async () => {
        setLoading(true);
        try {
            const response = await bankingAPI.getAllBanking();
            setBankingData(response.data || []);
        } catch (error) {
            console.error('Error fetching banking data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchValue) {
            fetchBankingData();
            return;
        }
        // Search implementation
        const filtered = bankingData.filter(item =>
            item.username?.toLowerCase().includes(searchValue.toLowerCase())
        );
        setBankingData(filtered);
    };

    const handleClearAll = () => {
        setPassword('');
    };

    const handleSubmit = () => {
        if (!password) {
            alert('Please enter password');
            return;
        }
        alert('Banking transaction submitted');
        setPassword('');
    };

    const handlePayment = () => {
        alert('Payment functionality to be implemented');
    };

    return (
        <div className="page">
            <h3 style={{ border: 'none' }}>Banking</h3>

            <div className="banking-filter-section">
                <input
                    type="text"
                    placeholder="Find member..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <button className="search" onClick={handleSearch}>Search</button>
                <select value={statusValue} onChange={(e) => setStatusValue(e.target.value)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <span className="refresh-icon" onClick={fetchBankingData}>⟳</span>
            </div>

            <div className="balance-display">
                Your Balance <span style={{ marginLeft: '10px' }}>BDT {balance?.toFixed(2) || '0.00'}</span>
            </div>

            <div className="data-table-container">
                <div className="table-header">
                    <div style={{ flex: 1 }}>UID</div>
                    <div style={{ flex: 1 }}>Balance</div>
                    <div style={{ flex: 1 }}>Available D/W</div>
                    <div style={{ flex: 1 }}>Exposure</div>
                    <div style={{ flex: 1 }}>Deposit / Withdraw</div>
                    <div style={{ flex: 1 }}>Credit Reference</div>
                    <div style={{ flex: 1 }}>Reference P/L</div>
                    <div style={{ flex: 1 }}>Remark</div>
                    <div style={{ flex: 1, color: '#007bff', cursor: 'pointer' }}>All Logs</div>
                </div>

                {loading ? (
                    <div className="table-body">Loading...</div>
                ) : bankingData.length > 0 ? (
                    bankingData.map((item, idx) => (
                        <div key={idx} className="table-row">
                            <div style={{ flex: 1 }}>{item.uid || item.username}</div>
                            <div style={{ flex: 1 }}>BDT {item.balance || 0}</div>
                            <div style={{ flex: 1 }}>BDT {item.availableDW || 0}</div>
                            <div style={{ flex: 1 }}>BDT {item.exposure || 0}</div>
                            <div style={{ flex: 1 }}>
                                <input type="number" placeholder="Amount" style={{ width: '80px' }} />
                            </div>
                            <div style={{ flex: 1 }}>{item.creditRef || '-'}</div>
                            <div style={{ flex: 1 }}>BDT {item.referencePL || 0}</div>
                            <div style={{ flex: 1 }}>
                                <input type="text" placeholder="Remark" style={{ width: '80px' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <button className="search" style={{ padding: '4px 8px', fontSize: '11px' }}>Logs</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="table-body">No banking records found</div>
                )}

                <div className="form-section">
                    <button className="clear" onClick={handleClearAll}>Clear All</button>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="submit" onClick={handleSubmit}>Submit</button>
                    <button className="payment" onClick={handlePayment}>P Payment</button>
                </div>
            </div>
        </div>
    );
}
