import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import { bettingAPI } from '../../services/api';

export default function BetListLive() {
    const [selectedSports, setSelectedSports] = useState({
        cricket: false,
        tennis: false,
        soccer: false,
        casino: false,
        betfair: false,
        bookmaker: false,
        fancy: false,
        sportsbook: false,
    });
    const [orderBy, setOrderBy] = useState('stake');
    const [orderType, setOrderType] = useState('ascending');
    const [lastTxn, setLastTxn] = useState('25');
    const [autoRefresh, setAutoRefresh] = useState('15');
    const [betStatus, setBetStatus] = useState('active');
    const [liveBets, setLiveBets] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSportChange = (sport) => {
        setSelectedSports(prev => ({
            ...prev,
            [sport]: !prev[sport]
        }));
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const activeSports = Object.keys(selectedSports).filter(sport => selectedSports[sport]);
            const response = await bettingAPI.getLiveBets({
                sports: activeSports,
                orderBy,
                orderType,
                limit: lastTxn,
                status: betStatus
            });
            setLiveBets(response.data || []);
        } catch (error) {
            console.error('Error fetching live bets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSelectedSports({
            cricket: false,
            tennis: false,
            soccer: false,
            casino: false,
            betfair: false,
            bookmaker: false,
            fancy: false,
            sportsbook: false,
        });
        setLiveBets([]);
    };

    // Auto refresh functionality
    useEffect(() => {
        if (autoRefresh && parseInt(autoRefresh) > 0) {
            const interval = setInterval(() => {
                handleSearch();
            }, parseInt(autoRefresh) * 1000);

            return () => clearInterval(interval);
        }
    }, [autoRefresh, selectedSports, betStatus]);

    const tableHeaders = [
        { label: 'PL ID', key: 'plId' },
        { label: 'Bet ID', key: 'betId' },
        { label: 'Bet placed', key: 'createdAt' },
        { label: 'IP Address', key: 'ipAddress' },
        { label: 'Market', key: 'market' },
        { label: 'Selection', key: 'selection' },
        { label: 'Type', key: 'type' },
        { label: 'Odds req.', key: 'odds' },
        { label: 'Stake', key: 'stake', render: (row) => `BDT ${row.stake}` },
        { label: 'Liability', key: 'liability', render: (row) => `BDT ${row.liability}` },
        { label: 'Profit/Loss', key: 'profitLoss', render: (row) => `BDT ${row.profitLoss || 0}` },
    ];

    return (
        <div className="page">
            <h3 style={{ border: 'none' }}>Bet List Live</h3>

            <div className="sports-filter">
                {Object.keys(selectedSports).map(sport => (
                    <label key={sport}>
                        <input
                            type="checkbox"
                            checked={selectedSports[sport]}
                            onChange={() => handleSportChange(sport)}
                        />
                        {sport.charAt(0).toUpperCase() + sport.slice(1)}
                    </label>
                ))}
            </div>

            <div className="date-filter" style={{ backgroundColor: '#f5f5f5', border: 'none', padding: '10px 0', marginBottom: '5px' }}>
                <label>Order of display:</label>
                <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
                    <option value="stake">Stake</option>
                    <option value="time">Time</option>
                    <option value="odds">Odds</option>
                </select>

                <label>of</label>
                <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                    <option value="ascending">Ascending</option>
                    <option value="descending">Descending</option>
                </select>

                <label>Last</label>
                <select value={lastTxn} onChange={(e) => setLastTxn(e.target.value)}>
                    <option value="25">25 Txn</option>
                    <option value="50">50 Txn</option>
                    <option value="100">100 Txn</option>
                </select>

                <label>Auto Refresh (Seconds)</label>
                <select value={autoRefresh} onChange={(e) => setAutoRefresh(e.target.value)}>
                    <option value="0">Off</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                </select>

                <label>Bet Status:</label>
                <select value={betStatus} onChange={(e) => setBetStatus(e.target.value)}>
                    <option value="active">Active</option>
                    <option value="settled">Settled</option>
                </select>

                <button className="search" onClick={handleSearch}>Search</button>
                <button className="reset" onClick={handleReset}>Reset</button>
            </div>

            <p className="info-text">
                Betting History enables you to review the bets you have placed. Specify the time period during which
                your bets were placed, the type of markets on which the bets were placed, and the sport.<br />
                Betting History is available online for the past 30 days.
            </p>

            <h4 style={{ backgroundColor: '#0d4766', color: 'white', padding: '8px 15px', marginTop: 0, fontSize: '14px' }}>
                Matched
            </h4>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <DataTable
                    headers={tableHeaders}
                    data={liveBets}
                    emptyMessage="No active bets"
                />
            )}
        </div>
    );
}
