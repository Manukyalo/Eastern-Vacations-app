const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', '..', 'Dashboard');
const srcDir = path.join(targetDir, 'src');

if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
}

// App.jsx
const appJsx = `
import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/reservations/queue');
      const data = await res.json();
      if(data.success) setQueue(data.queue);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000); // polls every 5s
    return () => clearInterval(interval);
  }, []);

  const handleClaim = async (id) => {
    try {
      await fetch('http://localhost:3000/api/reservations/queue/' + id + '/claim', { method: 'PUT' });
      fetchQueue();
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Eastern Vacations</h1>
        <p>Reservations & Priority Waitlist Dashboard</p>
      </header>
      
      <div className="content">
        {loading ? <p>Loading queue...</p> : queue.length === 0 ? (
          <div className="empty-state">No pending reservations or chats.</div>
        ) : (
          <div className="grid">
            {queue.map(req => (
              <div key={req.id} className={\`card \${req.status.toLowerCase()}\`}>
                <div className="card-header">
                  <h3>{req.name}</h3>
                  <span className="badge">{req.status}</span>
                </div>
                <div className="card-body">
                  <p><strong>Package:</strong> {req.packageInterest}</p>
                  <p><strong>Email:</strong> {req.email}</p>
                  <p><strong>Preferences:</strong> {req.preferences}</p>
                  <p className="time">{new Date(req.timestamp).toLocaleString()}</p>
                </div>
                {req.status === 'Waiting' && (
                  <button onClick={() => handleClaim(req.id)} className="claim-btn">Claim Inquiry</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(srcDir, 'App.jsx'), appJsx);

const appCss = `
* { box-sizing: border-box; }
body { margin: 0; font-family: 'Inter', system-ui, sans-serif; background: #fdfdfd; color: #333; }
.dashboard { max-width: 1200px; margin: 0 auto; padding: 2rem; }
header { margin-bottom: 2rem; border-bottom: 2px solid #E5A93C; padding-bottom: 1rem; }
header h1 { margin: 0 0 0.5rem 0; color: #111; font-size: 2rem; }
header p { margin: 0; color: #666; font-size: 1.1rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
.card { background: #fff; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #eee; transition: transform 0.2s; }
.card:hover { transform: translateY(-4px); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.card-header h3 { margin: 0; font-size: 1.25rem; }
.badge { padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.85rem; font-weight: bold; background: #eee; color: #666; }
.card.waiting { border-top: 4px solid #E5A93C; }
.card.waiting .badge { background: rgba(229,169,60,0.2); color: #B37D1A; }
.card.claimed { opacity: 0.7; border-top: 4px solid #4CAF50; }
.card.claimed .badge { background: rgba(76,175,80,0.15); color: #388E3C; }
.card-body p { margin: 0.5rem 0; font-size: 0.95rem; }
.time { font-size: 0.8rem !important; color: #999; margin-top: 1rem !important; }
.claim-btn { margin-top: 1rem; width: 100%; background: #111; color: white; border: none; padding: 0.75rem; border-radius: 8px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
.claim-btn:hover { background: #E5A93C; color: #111; }
.empty-state { text-align: center; padding: 4rem; color: #888; background: #f9f9f9; border-radius: 12px; border: 2px dashed #ddd; }
`;
fs.writeFileSync(path.join(srcDir, 'App.css'), appCss);

const mainJsx = `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;
fs.writeFileSync(path.join(srcDir, 'main.jsx'), mainJsx);

console.log('Dashboard setup completed successfully.');
