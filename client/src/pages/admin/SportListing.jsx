import React, { useState, useEffect } from 'react';
import ToggleSwitch from '../../components/ToggleSwitch';
import { sportAPI } from '../../services/api';

export default function SportListing() {
    const [sports, setSports] = useState([
        { id: 6, betfairId: 6, name: 'Inter Casino', status: true },
        { id: 7, betfairId: 7, name: 'AWC Casino', status: true },
        { id: 4, betfairId: 4, name: 'Cricket', status: true },
        { id: 2, betfairId: 2, name: 'Tennis', status: true },
        { id: 8, betfairId: 8, name: 'Deposit / Withdraw', status: true },
        { id: 1, betfairId: 1, name: 'Soccer', status: true },
    ]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSports();
    }, []);

    const fetchSports = async () => {
        setLoading(true);
        try {
            const response = await sportAPI.getAllSports();
            if (response.data && response.data.length > 0) {
                setSports(response.data);
            }
        } catch (error) {
            console.error('Error fetching sports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (index, status) => {
        const updatedSports = [...sports];
        updatedSports[index].status = status;
        setSports(updatedSports);

        try {
            await sportAPI.toggleSport(updatedSports[index].id, status);
        } catch (error) {
            console.error('Error updating sport status:', error);
            // Revert on error
            updatedSports[index].status = !status;
            setSports(updatedSports);
        }
    };

    return (
        <div className="page">
            <h3 style={{ border: 'none' }}>Sport Listing</h3>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="data-table-container">
                    <div className="table-header">
                        <div style={{ flex: '0 0 50px' }}>S.No.</div>
                        <div style={{ flex: 1 }}>Betfair ID</div>
                        <div style={{ flex: 1 }}>Name</div>
                        <div style={{ flex: 1.5 }}>Status</div>
                        <div style={{ flex: '0 0 80px' }}>Action</div>
                    </div>

                    {sports.map((sport, index) => (
                        <div key={sport.id} className="table-row">
                            <div style={{ flex: '0 0 50px' }}>{index + 1}</div>
                            <div style={{ flex: 1 }}>{sport.betfairId}</div>
                            <div style={{ flex: 1 }}>
                                <a href="#" style={{ color: '#007bff' }}>{sport.name}</a>
                            </div>
                            <div style={{ flex: 1.5 }}>
                                {sport.name} is {sport.status ? 'ON' : 'OFF'}
                            </div>
                            <div style={{ flex: '0 0 80px' }}>
                                <ToggleSwitch
                                    checked={sport.status}
                                    onChange={(checked) => handleToggle(index, checked)}
                                    label={sport.name}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
