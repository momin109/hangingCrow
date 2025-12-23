import React from 'react';

export default function BalanceCards({ balances }) {
    return (
        <div className="balance-cards">
            {balances.map((balance, index) => (
                <div key={index} className="balance-card">
                    <div className="label">{balance.label}</div>
                    <div className={`value ${balance.isExposure ? 'exposure' : ''}`}>
                        {balance.currency} {balance.value.toFixed(2)}
                    </div>
                </div>
            ))}
        </div>
    );
}
