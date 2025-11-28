import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function Profile() {
    const { user } = useAuth();
    const [file, setFile] = useState(null);

    function handleUpload(e) {
        e.preventDefault();
        if (!file) return alert('Choose a file');
        alert('KYC document uploaded (demo)');
    }

    return (
        <div className="page">
            <h2>Profile</h2>

            <div className="card">
                <h4>User Information</h4>
                <p>Username: <b>{user?.username}</b></p>
                <p>Role: <b>{user?.role}</b></p>
                <p>User ID: <small>{user?.id}</small></p>
            </div>

            <div className="card">
                <h4>KYC Verification</h4>
                <form onSubmit={handleUpload}>
                    <label>Upload ID Document</label><br />
                    <input
                        type="file"
                        onChange={e => setFile(e.target.files[0])}
                        accept="image/*,.pdf"
                    />
                    <br /><br />
                    <button type="submit">Upload</button>
                </form>
            </div>
        </div>
    );
}
