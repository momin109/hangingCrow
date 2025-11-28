import React, { useState } from "react";

export default function Wallet() {
    const [amount, setAmount] = useState('');

    function handleDeposit() {
        if (!amount) return alert('Enter amount');
        alert(`Deposit request for ৳${amount} submitted (demo)`);
        setAmount('');
    }

    function handleWithdraw() {
        if (!amount) return alert('Enter amount');
        alert(`Withdraw request for ৳${amount} submitted (demo)`);
        setAmount('');
    }

    return (
        <div className="page">
            <h2>Wallet</h2>

            <div className="card">
                <h4>Deposit / Withdraw</h4>
                <input
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    type="number"
                    style={{ width: '200px' }}
                />
                <br /><br />
                <button onClick={handleDeposit}>Request Deposit</button>&nbsp;
                <button onClick={handleWithdraw}>Request Withdraw</button>
            </div>

            <div className="card">
                <h4>Transaction History</h4>
                <div style={{ color: '#9fb0c8' }}>No transactions yet (demo)</div>
            </div>
        </div>
    );
}
