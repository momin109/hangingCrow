import React, { useState, useEffect } from 'react';
import { riskAPI } from '../../services/api';

export default function RiskManagement() {
    const [topPlayers, setTopPlayers] = useState([]);
    const [fancyBets, setFancyBets] = useState([]);
    const [sportsbookRisk, setSportsbookRisk] = useState([]);
    const [premiumCricket, setPremiumCricket] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRiskData();
    }, []);

    const fetchRiskData = async () => {
        setLoading(true);
        try {
            const [playersRes, fancyRes, sportsbookRes, cricketRes] = await Promise.all([
                riskAPI.getTopPlayers(10),
                riskAPI.getFancyBets(),
                riskAPI.getSportsbookRisk(),
                riskAPI.getPremiumCricket()
            ]);

            setTopPlayers(playersRes.data || []);
            setFancyBets(fancyRes.data || []);
            setSportsbookRisk(sportsbookRes.data || []);
            setPremiumCricket(cricketRes.data || []);
        } catch (error) {
            console.error('Error fetching risk data:', error);
        } finally {
            setLoading(false);
        }
    };

    const RiskSection = ({ title, data, headers }) => (
        <>
            <h4 style={{ backgroundColor: '#0d4766', color: 'white', padding: '8px 15px', marginTop: '20px', fontSize: '14px' }}>
                {title}
            </h4>
            <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '10px' }}>
                <div className="table-header" style={{ backgroundColor: '#fff', padding: 0, border: 'none' }}>
                    {headers.map((header, idx) => (
                        <div key={idx} style={header.style}>{header.label}</div>
                    ))}
                </div>
                <div className="table-body" style={{ textAlign: 'left', padding: '10px' }}>
                    {data && data.length > 0 ? (
                        data.map((row, idx) => (
                            <div key={idx} className="table-row">
                                {headers.map((header, hIdx) => (
                                    <div key={hIdx} style={header.style}>
                                        {header.render ? header.render(row) : row[header.key]}
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        'No records found'
                    )}
                </div>
            </div>
        </>
    );

    const playerHeaders = [
        { label: 'UID', key: 'uid', style: { flex: 1 } },
        { label: 'Exposure', key: 'exposure', style: { flex: 1 }, render: (row) => `BDT ${row.exposure}` },
        { label: 'Matched Amount', key: 'matchedAmount', style: { flex: 1 }, render: (row) => `BDT ${row.matchedAmount}` },
    ];

    const marketHeaders = [
        { label: 'Sports', key: 'sport', style: { flex: 1.5 } },
        { label: 'Market Date', key: 'marketDate', style: { flex: 1.5 } },
        { label: 'Event/Market Name', key: 'eventName', style: { flex: 3 } },
        { label: 'Player P/L', key: 'playerPL', style: { flex: 2, backgroundColor: '#ffc', textAlign: 'center' }, render: (row) => `BDT ${row.playerPL}` },
        { label: 'Downline P/L', key: 'downlinePL', style: { flex: 2, backgroundColor: '#f7f7e0', textAlign: 'center' }, render: (row) => `BDT ${row.downlinePL}` },
    ];

    return (
        <div className="page">
            <h3 className="component-title" style={{ border: 'none' }}>Risk Management Summary</h3>

            {loading ? (
                <div className="loading">Loading risk data...</div>
            ) : (
                <>
                    <div style={{ backgroundColor: '#0d4766', color: 'white', padding: '8px 15px', fontSize: '14px', marginBottom: '15px' }}>
                        Top 10 Matched Amount Player
                    </div>
                    <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '10px' }}>
                        <div className="table-header" style={{ backgroundColor: '#fff', padding: 0, border: 'none' }}>
                            {playerHeaders.map((header, idx) => (
                                <div key={idx} style={header.style}>{header.label}</div>
                            ))}
                        </div>
                        <div className="table-body" style={{ textAlign: 'left', padding: '10px' }}>
                            {topPlayers.length > 0 ? (
                                topPlayers.map((player, idx) => (
                                    <div key={idx} className="table-row">
                                        <div style={{ flex: 1 }}>{player.uid || player.username}</div>
                                        <div style={{ flex: 1 }}>BDT {player.exposure || 0}</div>
                                        <div style={{ flex: 1 }}>BDT {player.matchedAmount || 0}</div>
                                    </div>
                                ))
                            ) : (
                                'No records found'
                            )}
                        </div>
                    </div>

                    <RiskSection title="Fancy Bet" data={fancyBets} headers={marketHeaders} />
                    <RiskSection title="Sports Book" data={sportsbookRisk} headers={marketHeaders} />
                    <RiskSection title="Premium Cricket" data={premiumCricket} headers={marketHeaders} />
                </>
            )}
        </div>
    );
}
