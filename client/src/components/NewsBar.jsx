import React from 'react';

export default function NewsBar({ message = "📰 News" }) {
    return (
        <div className="news-bar">
            {message}
        </div>
    );
}
