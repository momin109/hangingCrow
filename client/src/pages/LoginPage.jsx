import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!username.trim()) {
            setError('Please enter your username');
            return;
        }
        if (!password.trim()) {
            setError('Please enter your password');
            return;
        }

        setLoading(true);

        try {
            const user = await login(username.trim(), password);

            // Navigate based on role
            if (['ADMIN', 'B2C_SUBADMIN', 'B2B_SUBADMIN', 'SUPERADMIN', 'WHITELABEL', 'MOTHER', 'OWNER'].includes(user.role)) {
                navigate('/admin/dashboard');
            } else if (['AGENT', 'MASTER_AGENT', 'SUPER_AGENT'].includes(user.role)) {
                navigate('/agent/dashboard');
            } else {
                navigate('/user/dashboard');
            }
        } catch (err) {
            let errorMessage = 'Login failed. Please check your credentials.';
            
            if (err.response) {
                // Server responded with error
                errorMessage = err.response.data?.message || 
                             err.response.data?.error || 
                             `Server error: ${err.response.status}`;
            } else if (err.request) {
                // Request made but no response received
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (err.message) {
                // Error message from axios
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page card" style={{ maxWidth: 420, margin: '40px auto' }}>
            <h3 style={{ marginBottom: '20px' }}>Login</h3>

            {error && (
                <div style={{ 
                    padding: '12px', 
                    background: '#e74c3c', 
                    borderRadius: '6px', 
                    marginBottom: '16px', 
                    color: '#fff',
                    fontSize: '14px',
                    wordWrap: 'break-word'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '6px' }}>Username</label>
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Enter username"
                        required
                        disabled={loading}
                        style={{ 
                            width: '100%',
                            padding: '8px',
                            fontSize: '14px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                        autoComplete="username"
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '6px' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                        disabled={loading}
                        style={{ 
                            width: '100%',
                            padding: '8px',
                            fontSize: '14px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                        autoComplete="current-password"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        width: '100%',
                        padding: '12px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        background: loading ? '#ccc' : '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1
                    }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div style={{ marginTop: 16, fontSize: 13, color: '#9fb0c8' }}>
                <b>Demo Accounts:</b><br />
                owner / password123<br />
                admin / password123<br />
                agent / password123<br />
                testuser / password123
            </div>
        </div>
    );
}
