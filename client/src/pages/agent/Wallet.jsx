import React, { useState } from "react";

export default function AgentWallet() {
    const [userId, setUserId] = useState('');
    const [amount, setAmount] = useState('');

    function handleGive() {
        if (!userId || !amount) return alert('Fill all fields');
        alert(`Given ৳${amount} to user ${userId} (demo)`);
    }

    function handleTake() {
        if (!userId || !amount) return alert('Fill all fields');
        alert(`Taken ৳${amount} from user ${userId} (demo)`);
    }

    return (
        <div className="page">
            <h2>Agent Wallet</h2>

            <div className="card">
                <h4>Manage Client Balance</h4>
                <input
                    placeholder="User ID or Username"
                    value={userId}
                    onChange={e => setUserId(e.target.value)}
                    style={{ width: '200px', marginRight: '8px' }}
                />
                <input
                    placeholder="Amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    type="number"
                    style={{ width: '150px' }}
                />
                <br /><br />
                <button onClick={handleGive}>Give Balance</button>&nbsp;
                <button onClick={handleTake}>Take Balance</button>
            </div>
        </div>
    );
}
