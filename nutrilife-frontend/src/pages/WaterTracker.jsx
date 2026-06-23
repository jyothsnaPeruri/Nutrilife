import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QUICK_AMOUNTS = [150, 200, 250, 300, 500];

export default function WaterTracker() {
  const [summary, setSummary] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/water/summary', { headers });
      const data = await res.json();
      setSummary(data);
    } catch {
      setError('Failed to load water data');
    }
  };

  useEffect(() => { fetchSummary(); }, []);

  const logWater = async (amount) => {
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:8080/api/water', {
        method: 'POST',
        headers,
        body: JSON.stringify({ amountMl: Number(amount), note })
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed to log water');
        return;
      }
      setSuccess(`+${amount}ml logged!`);
      setCustomAmount('');
      setNote('');
      fetchSummary();
      setTimeout(() => setSuccess(''), 2000);
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (id) => {
    await fetch(`http://localhost:8080/api/water/${id}`, {
      method: 'DELETE', headers
    });
    fetchSummary();
  };

  const getProgressColor = (pct) => {
    if (pct >= 100) return '#4CAF50';
    if (pct >= 60) return '#2196F3';
    if (pct >= 30) return '#FF9800';
    return '#FF5722';
  };

  const formatTime = (dt) => {
    return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ maxWidth: 800, margin: '30px auto', padding: '0 16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>💧 Water Tracker</h2>
        <button onClick={() => navigate('/dashboard')}
          style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}>
          ← Dashboard
        </button>
      </div>

      {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
      {success && <p style={{ color: '#4CAF50', marginBottom: 12, fontWeight: 600 }}>{success}</p>}

      {summary && (
        <>
          {/* Progress Circle */}
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 16, padding: 28, marginBottom: 20, textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="80" fill="none" stroke="#f0f0f0" strokeWidth="14" />
                <circle cx="90" cy="90" r="80" fill="none"
                  stroke={getProgressColor(summary.percentage)}
                  strokeWidth="14"
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - summary.percentage / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 90 90)"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
                <text x="90" y="82" textAnchor="middle" fontSize="28" fontWeight="700"
                  fill={getProgressColor(summary.percentage)}>
                  {summary.percentage.toFixed(0)}%
                </text>
                <text x="90" y="106" textAnchor="middle" fontSize="13" fill="#888">
                  {summary.totalMl} / {summary.goalMl} ml
                </text>
              </svg>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#2196F3' }}>{summary.totalMl}</div>
                <div style={{ fontSize: 12, color: '#888' }}>ml consumed</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#4CAF50' }}>{summary.goalMl}</div>
                <div style={{ fontSize: 12, color: '#888' }}>ml daily goal</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#FF9800' }}>{summary.remainingMl}</div>
                <div style={{ fontSize: 12, color: '#888' }}>ml remaining</div>
              </div>
            </div>

            {summary.percentage >= 100 && (
              <div style={{ marginTop: 16, padding: '10px 16px', background: '#f0fff0', borderRadius: 8, color: '#4CAF50', fontWeight: 600 }}>
                🎉 Daily goal reached! Great job!
              </div>
            )}
          </div>

          {/* Quick Add Buttons */}
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 14px' }}>Quick Add</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
              {QUICK_AMOUNTS.map(amount => (
                <button key={amount} onClick={() => logWater(amount)} disabled={loading}
                  style={{
                    padding: '10px 18px', borderRadius: 8,
                    border: '1.5px solid #2196F3', color: '#2196F3',
                    background: '#fff', cursor: 'pointer', fontWeight: 600,
                    fontSize: 14
                  }}>
                  💧 {amount}ml
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input type="number" placeholder="Custom amount (ml)"
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                min="1"
                style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }} />
              <input type="text" placeholder="Note (optional)"
                value={note}
                onChange={e => setNote(e.target.value)}
                style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }} />
              <button onClick={() => logWater(customAmount)} disabled={loading}
                style={{
                  padding: '10px 20px', borderRadius: 8,
                  background: '#2196F3', color: '#fff',
                  border: 'none', cursor: 'pointer', fontWeight: 600
                }}>
                {loading ? '...' : 'Add'}
              </button>
            </div>
          </div>

          {/* Today's Logs */}
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 16, padding: 20 }}>
            <h3 style={{ margin: '0 0 14px' }}>📋 Today's Logs</h3>
            {summary.logs.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: 20 }}>
                No water logged today. Stay hydrated! 💧
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                {summary.logs.map(log => (
                  <div key={log.id} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '10px 14px',
                    background: '#f8fbff', borderRadius: 8,
                    border: '1px solid #e3f2fd'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 20 }}>💧</span>
                      <div>
                        <span style={{ fontWeight: 600, color: '#2196F3' }}>{log.amountMl} ml</span>
                        {log.note && <span style={{ marginLeft: 8, fontSize: 12, color: '#888' }}>{log.note}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 12, color: '#aaa' }}>{formatTime(log.loggedAt)}</span>
                      <button onClick={() => deleteLog(log.id)}
                        style={{
                          padding: '4px 10px', borderRadius: 4,
                          border: '1px solid #ffcccc', color: '#e53935',
                          background: '#fff5f5', cursor: 'pointer', fontSize: 12
                        }}>
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}