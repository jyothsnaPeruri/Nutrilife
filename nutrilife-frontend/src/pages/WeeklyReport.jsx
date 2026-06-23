import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/appStore';
import useWebSocket from '../hooks/useWebSocket';

export default function WeeklyReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAppStore();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { connected } = useWebSocket(user?.email);

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/reports', { headers });
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const generateReport = async () => {
    setGenerating(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:8080/api/reports/generate', {
        method: 'POST', headers
      });
      if (!res.ok) {
        setError('Failed to generate report');
        return;
      }
      setSuccess('Report generated successfully! Check your email too.');
      fetchReports();
    } catch {
      setError('Cannot connect to server');
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div style={{ maxWidth: 800, margin: '30px auto', padding: '0 16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0 }}>🤖 Weekly AI Report</h2>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: 13 }}>
            Personalized feedback generated every Sunday
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={generateReport} disabled={generating}
            style={{
              padding: '8px 16px', borderRadius: 6,
              background: '#4CAF50', color: '#fff',
              border: 'none', cursor: 'pointer', fontWeight: 600
            }}>
            {generating ? '⏳ Generating...' : '✨ Generate Now'}
          </button>
          <button onClick={() => navigate('/dashboard')}
            style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}>
            ← Dashboard
          </button>
        </div>
      </div>

      {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
      {success && (
        <div style={{ background: '#f0fff0', border: '1px solid #4CAF50', borderRadius: 8, padding: 12, marginBottom: 16 }}>
          <p style={{ margin: 0, color: '#4CAF50', fontWeight: 600 }}>✅ {success}</p>
        </div>
      )}

      {/* Generating state */}
      {generating && (
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 32, textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
          <h3 style={{ margin: '0 0 8px' }}>AI is analyzing your week...</h3>
          <p style={{ color: '#888', margin: 0 }}>This takes about 10-15 seconds</p>
          <div style={{ marginTop: 16, background: '#f0f0f0', borderRadius: 10, height: 6, overflow: 'hidden' }}>
            <div style={{
              height: '100%', background: '#4CAF50', borderRadius: 10,
              animation: 'loading 2s ease-in-out infinite',
              width: '60%'
            }} />
          </div>
        </div>
      )}

      {/* Reports list */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#aaa' }}>Loading reports...</p>
      ) : reports.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <h3 style={{ margin: '0 0 8px' }}>No reports yet</h3>
          <p style={{ color: '#888', margin: '0 0 20px' }}>
            Log your meals, water, and workouts for a week, then generate your first AI report!
          </p>
          <button onClick={generateReport} disabled={generating}
            style={{
              padding: '12px 24px', borderRadius: 8,
              background: '#4CAF50', color: '#fff',
              border: 'none', cursor: 'pointer', fontSize: 15
            }}>
            ✨ Generate My First Report
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {reports.map((report, idx) => (
            <div key={report.id} style={{
              background: '#fff', border: '1px solid #eee',
              borderRadius: 16, overflow: 'hidden',
              boxShadow: idx === 0 ? '0 2px 12px rgba(76,175,80,0.1)' : 'none'
            }}>
              {/* Report header */}
              <div style={{
                background: idx === 0 ? '#4CAF50' : '#f9f9f9',
                padding: '16px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ margin: 0, color: idx === 0 ? '#fff' : '#333' }}>
                    {idx === 0 ? '⭐ Latest Report' : `Report #${reports.length - idx}`}
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: idx === 0 ? '#e8f5e9' : '#888' }}>
                    {formatDate(report.weekStart)} — {formatDate(report.weekEnd)}
                  </p>
                </div>
                <div style={{
                  background: idx === 0 ? 'rgba(255,255,255,0.2)' : '#fff',
                  borderRadius: 10, padding: '8px 16px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: idx === 0 ? '#fff' : '#4CAF50' }}>
                    {report.goalAchievementPercent}%
                  </div>
                  <div style={{ fontSize: 11, color: idx === 0 ? '#e8f5e9' : '#888' }}>goal achieved</div>
                </div>
              </div>

              {/* Stats row */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 0, borderBottom: '1px solid #f0f0f0'
              }}>
                {[
                  { label: 'Avg Calories', value: `${report.avgDailyCalories?.toFixed(0)} kcal`, icon: '🔥' },
                  { label: 'Avg Protein', value: `${report.avgDailyProtein?.toFixed(1)}g`, icon: '💪' },
                  { label: 'Avg Water', value: `${report.avgDailyWaterMl?.toFixed(0)}ml`, icon: '💧' },
                  { label: 'Workouts', value: report.totalWorkouts, icon: '🏋️' },
                ].map(s => (
                  <div key={s.label} style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid #f0f0f0' }}>
                    <div style={{ fontSize: 18 }}>{s.icon}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, margin: '4px 0 2px' }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* AI Feedback */}
              <div style={{ padding: 20 }}>
                <h4 style={{ margin: '0 0 12px', color: '#4CAF50' }}>
                  🤖 AI Wellness Coach Feedback
                </h4>
                <div style={{
                  background: '#f8fff8', borderLeft: '3px solid #4CAF50',
                  borderRadius: '0 8px 8px 0', padding: '14px 16px',
                  fontSize: 14, lineHeight: 1.7, color: '#444',
                  whiteSpace: 'pre-line'
                }}>
                  {report.aiFeedback}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}