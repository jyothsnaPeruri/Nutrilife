import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { Alert, Button, Card, EmptyState, Input, PageHeader, Ring, fmtTime } from '../components/ui';

const QUICK_AMOUNTS = [150, 200, 250, 300, 500];

const progressColor = (pct) => {
  if (pct >= 100) return 'var(--brand)';
  if (pct >= 60) return 'var(--water)';
  if (pct >= 30) return 'var(--warn)';
  return 'var(--cal)';
};

export default function WaterTracker() {
  const [summary, setSummary] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSummary = async () => {
    try {
      const res = await apiFetch('/water/summary');
      setSummary(await res.json());
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
      const res = await apiFetch('/water', { method: 'POST', body: JSON.stringify({ amountMl: Number(amount), note }) });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed to log water');
        return;
      }
      setSuccess(`+${amount} ml logged`);
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
    await apiFetch(`/water/${id}`, { method: 'DELETE' });
    fetchSummary();
  };

  const pct = summary ? Number(summary.percentage) || 0 : 0;
  const color = progressColor(pct);

  return (
    <>
      <PageHeader title="Water" subtitle="Small sips add up. Tap a quick amount or enter your own." />
      <Alert>{error}</Alert>
      <Alert type="success">{success}</Alert>

      {summary && (
        <div className="grid grid-2">
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
              <Ring value={pct} color={color} size={190}>
                <span style={{ fontSize: 34, fontWeight: 700, color, letterSpacing: '-0.02em' }}>{pct.toFixed(0)}%</span>
                <span className="muted small">{summary.totalMl} / {summary.goalMl} ml</span>
              </Ring>
              <div className="grid grid-3" style={{ width: '100%', textAlign: 'center' }}>
                <div><div style={{ fontSize: 20, fontWeight: 700, color: 'var(--water)' }}>{summary.totalMl}</div><div className="muted small">ml today</div></div>
                <div><div style={{ fontSize: 20, fontWeight: 700, color: 'var(--brand)' }}>{summary.goalMl}</div><div className="muted small">ml goal</div></div>
                <div><div style={{ fontSize: 20, fontWeight: 700, color: 'var(--warn)' }}>{summary.remainingMl}</div><div className="muted small">ml to go</div></div>
              </div>
              {pct >= 100 && <div className="alert success" style={{ margin: 0 }}>🎉 Daily goal reached — nicely done.</div>}
            </div>
          </Card>

          <div>
            <Card title="Quick add">
              <div className="form-row mb">
                {QUICK_AMOUNTS.map(amount => (
                  <Button key={amount} variant="outline" color="var(--water)" onClick={() => logWater(amount)} disabled={loading}>
                    💧 {amount} ml
                  </Button>
                ))}
              </div>
              <div className="form-grid">
                <Input type="number" min="1" placeholder="Custom amount (ml)" value={customAmount} onChange={e => setCustomAmount(e.target.value)} />
                <Input placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} />
              </div>
              <Button className="mt" block onClick={() => logWater(customAmount)} loading={loading}>Add</Button>
            </Card>

            <Card title="Today's log" action={<span className="muted small">{summary.logs?.length || 0} entries</span>}>
              {!summary.logs || summary.logs.length === 0 ? (
                <EmptyState icon="💧" title="Nothing yet" text="Stay hydrated — log your first glass." />
              ) : (
                <div className="list scroll" style={{ maxHeight: 300 }}>
                  {summary.logs.map(log => (
                    <div key={log.id} className="item">
                      <div>
                        <span className="title" style={{ color: 'var(--water)' }}>{log.amountMl} ml</span>
                        {log.note && <span className="muted small"> · {log.note}</span>}
                      </div>
                      <div className="buttons" style={{ alignItems: 'center', gap: 10 }}>
                        <span className="muted small">{fmtTime(log.loggedAt)}</span>
                        <Button size="sm" variant="danger" onClick={() => deleteLog(log.id)} aria-label="Delete">✕</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
