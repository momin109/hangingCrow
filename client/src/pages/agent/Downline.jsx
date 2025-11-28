import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

export default function AgentDownline() {
    const { user } = useAuth();
    const [tree, setTree] = useState(null);

    useEffect(() => {
        loadDownline();
    }, []);

    async function loadDownline() {
        try {
            const res = await axios.get(`/api/users/${user.id}/downline`);
            setTree(res.data);
        } catch (e) {
            console.error('Failed to load downline', e);
        }
    }

    function renderTree(node, level = 0) {
        if (!node) return null;

        return (
            <div style={{ marginLeft: level * 20 + 'px', marginTop: '8px' }}>
                <div style={{ padding: '8px', background: '#0f1a2b', borderRadius: '4px', display: 'inline-block' }}>
                    <b>{node.username}</b> ({node.role})
                    {node.wallet && (
                        <span style={{ color: '#22c1b6', marginLeft: '12px' }}>
                            ৳{parseFloat(node.wallet.balance || 0).toFixed(2)}
                        </span>
                    )}
                </div>
                {node.children && node.children.map((child, i) => (
                    <div key={i}>{renderTree(child, level + 1)}</div>
                ))}
            </div>
        );
    }

    return (
        <div className="page">
            <h2>Downline Tree</h2>

            <div className="card">
                <h4>Your Network</h4>
                {tree ? renderTree(tree) : <p>Loading...</p>}
            </div>
        </div>
    );
}
