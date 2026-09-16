import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { apiFetch } from '../services/api';
import { Alert, Button, Card, EmptyState, PageHeader, fmtDate } from '../components/ui';

export default function WeeklyReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/reports');
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
      const res = await apiFetch('/reports/generate', { method: 'POST' });
      if (!res.ok) {
        setError('Failed to generate report');
        return;
      }
      setSuccess('Report generated — it has been emailed to you as well.');
      fetchReports();
    } catch {
      setError('Cannot connect to server');
    } finally {
      setGenerating(false);
    }
  };

  // Oldest → newest for the trend line
  const trend = [...reports].reverse().map((r, i) => ({ week: `W${i + 1}`, pct: Number(r.goalAchievementPercent) || 0 }));

  return (
    <>
      <PageHeader
        title="Weekly AI report"
        subtitle="Your week, summarised and coached by AI. Generated every Sunday, or on demand."
        actions={<Button onClick={generateReport} loading={generating}>{generating ? 'Generating…' : '✨ Generate now'}</Button>}
      />
      <Alert>{error}</Alert>
      <Alert type="success">{success}</Alert>

      {generating && (
        <Card>
          <EmptyState icon="🤖" title="Reading your week…" text="Meals, water and workouts are being analysed. This takes about 10–15 seconds." />
        </Card>
      )}

      {trend.length > 1 && (
        <Card title="Goal achievement trend">
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13 }} />
                <Line type="monotone" dataKey="pct" name="Goals hit" stroke="var(--brand)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--brand)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {loading ? (
        <p className="muted" style={{ textAlign: 'center' }}>Loading reports…</p>
      ) : reports.length === 0 && !generating ? (
        <Card>
          <EmptyState icon="📊" title="No reports yet" text="Log meals, water and workouts for a few days, then generate your first report."
            action={<Button onClick={generateReport}>✨ Generate my first report</Button>} />
        </Card>
      ) : (
        <div className="list" style={{ gap: 16 }}>
          {reports.map((report, idx) => (
            <Card key={report.id} style={{ padding: 16 }}>
              <div className={`report-head ${idx === 0 ? 'latest' : ''}`}>
                <div>
                  <h3 style={{ fontSize: 16 }}>{idx === 0 ? '⭐ Latest report' : `Report #${reports.length - idx}`}</h3>
                  <p className="small" style={{ opacity: 0.85 }}>{fmtDate(report.weekStart)} — {fmtDate(report.weekEnd)}</p>
                </div>
                <div className="pct"><b>{report.goalAchievementPercent}%</b><small>goals hit</small></div>
              </div>

              <div className="grid grid-auto" style={{ margin: '14px 0' }}>
                {[
                  { label: 'Avg calories', value: `${Number(report.avgDailyCalories || 0).toFixed(0)} kcal`, icon: '🔥' },
                  { label: 'Avg protein', value: `${Number(report.avgDailyProtein || 0).toFixed(1)} g`, icon: '💪' },
                  { label: 'Avg water', value: `${Number(report.avgDailyWaterMl || 0).toFixed(0)} ml`, icon: '💧' },
                  { label: 'Workouts', value: report.totalWorkouts, icon: '🏋️' },
                ].map(s => (
                  <div key={s.label} className="stat compact">
                    <span className="ico">{s.icon}</span>
                    <span className="value" style={{ fontSize: 17 }}>{s.value}</span>
                    <span className="label">{s.label}</span>
                  </div>
                ))}
              </div>

              <h4 style={{ fontSize: 13, color: 'var(--brand-text)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>🤖 Coach's feedback</h4>
              <div className="feedback">{report.aiFeedback}</div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
