import React, { useState } from 'react';
import DataTable from '../../components/DataTable';
import { bettingAPI } from '../../services/api';

export default function BetList() {
    const [selectedSport, setSelectedSport] = useState('all');
    const [betStatus, setBetStatus] = useState('settled');
    const [lastTxn, setLastTxn] = useState('100');
    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await bettingAPI.getBetHistory({
                sport: selectedSport,
                status: betStatus,
                limit: lastTxn,
                fromDate,
                toDate
            });
            setBets(response.data || []);
        } catch (error) {
            console.error('Error fetching bet history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSelectedSport('all');
        setBetStatus('settled');
        setLastTxn('100');
        setFromDate(new Date().toISOString().split('T')[0]);
        setToDate(new Date().toISOString().split('T')[0]);
        setBets([]);
    };

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
            <h3 style={{ border: 'none' }}>Bet List</h3>

            <div className="sports-filter">
                <label><input type="radio" name="sport" value="cricket" checked={selectedSport === 'cricket'} onChange={(e) => setSelectedSport(e.target.value)} /> Cricket</label>
                <label><input type="radio" name="sport" value="tennis" checked={selectedSport === 'tennis'} onChange={(e) => setSelectedSport(e.target.value)} /> Tennis</label>
                <label><input type="radio" name="sport" value="soccer" checked={selectedSport === 'soccer'} onChange={(e) => setSelectedSport(e.target.value)} /> Soccer</label>
                <label><input type="radio" name="sport" value="casino" checked={selectedSport === 'casino'} onChange={(e) => setSelectedSport(e.target.value)} /> Casino</label>
                <label><input type="radio" name="sport" value="betfair" checked={selectedSport === 'betfair'} onChange={(e) => setSelectedSport(e.target.value)} /> Bet Fair</label>
                <label><input type="radio" name="sport" value="bookmaker" checked={selectedSport === 'bookmaker'} onChange={(e) => setSelectedSport(e.target.value)} /> Bookmaker</label>
                <label><input type="radio" name="sport" value="fancy" checked={selectedSport === 'fancy'} onChange={(e) => setSelectedSport(e.target.value)} /> Fancy</label>
                <label><input type="radio" name="sport" value="sportsbook" checked={selectedSport === 'sportsbook'} onChange={(e) => setSelectedSport(e.target.value)} /> SportsBook</label>
            </div>

            <div className="date-filter">
                <label>Bet Status:</label>
                <select value={betStatus} onChange={(e) => setBetStatus(e.target.value)}>
                    <option value="settled">Settled</option>
                    <option value="active">Active</option>
                    <option value="void">Void</option>
                </select>

                <label>Last</label>
                <select value={lastTxn} onChange={(e) => setLastTxn(e.target.value)}>
                    <option value="25">25 Txn</option>
                    <option value="50">50 Txn</option>
                    <option value="100">100 Txn</option>
                </select>

                <label>From</label>
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />

                <label>To</label>
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />

                <button onClick={() => setFromDate(new Date().toISOString().split('T')[0])}>Just For Today</button>
                <button onClick={() => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    setFromDate(yesterday.toISOString().split('T')[0]);
                }}>From Yesterday</button>
                <button className="search" onClick={handleSearch}>Search</button>
                <button className="reset" onClick={handleReset}>Reset</button>
            </div>

            <p className="info-text">
                Betting History enables you to review the bets you have placed. Specify the time period during which
                your bets were placed, the type of markets on which the bets were placed, and the sport.<br />
                Betting History is available online for the past 30 days.
            </p>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <DataTable
                    headers={tableHeaders}
                    data={bets}
                    emptyMessage="You have no bets in this time period."
                />
            )}
        </div>
    );
}
