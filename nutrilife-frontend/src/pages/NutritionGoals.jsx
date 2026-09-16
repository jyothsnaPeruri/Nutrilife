import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { Alert, Button, Card, Field, Input, PageHeader, ProgressBar, Tabs } from '../components/ui';

const defaultForm = {
  dailyCalories: 2000, dailyProtein: 50, dailyCarbs: 250, dailyFat: 65,
  dailyFiber: 25, dailyWaterMl: 2500, weeklyWorkouts: 5
};

const progressItems = [
  { key: 'calorie', label: 'Calories', unit: 'kcal', color: 'var(--cal)', icon: '🔥' },
  { key: 'protein', label: 'Protein', unit: 'g', color: 'var(--protein)', icon: '💪' },
  { key: 'carbs', label: 'Carbs', unit: 'g', color: 'var(--carbs)', icon: '🍞' },
  { key: 'fat', label: 'Fat', unit: 'g', color: 'var(--fat)', icon: '🧈' },
  { key: 'fiber', label: 'Fibre', unit: 'g', color: 'var(--fiber)', icon: '🌾' },
  { key: 'water', label: 'Water', unit: 'ml', color: 'var(--water)', icon: '💧' },
  { key: 'workout', label: 'Workouts', unit: 'this week', color: 'var(--workout)', icon: '🏋️' },
];

const FIELDS = [
  { label: '🔥 Daily calories (kcal)', key: 'dailyCalories' },
  { label: '💪 Daily protein (g)', key: 'dailyProtein' },
  { label: '🍞 Daily carbs (g)', key: 'dailyCarbs' },
  { label: '🧈 Daily fat (g)', key: 'dailyFat' },
  { label: '🌾 Daily fibre (g)', key: 'dailyFiber' },
  { label: '💧 Daily water (ml)', key: 'dailyWaterMl' },
  { label: '🏋️ Weekly workouts', key: 'weeklyWorkouts' },
];

const PRESETS = [
  { label: '⚖️ Weight loss', values: { dailyCalories: 1500, dailyProtein: 120, dailyCarbs: 150, dailyFat: 50, dailyFiber: 30, dailyWaterMl: 3000, weeklyWorkouts: 5 } },
  { label: '💪 Muscle gain', values: { dailyCalories: 2800, dailyProtein: 180, dailyCarbs: 300, dailyFat: 80, dailyFiber: 25, dailyWaterMl: 3500, weeklyWorkouts: 6 } },
  { label: '🧘 Maintenance', values: { dailyCalories: 2000, dailyProtein: 80, dailyCarbs: 250, dailyFat: 65, dailyFiber: 25, dailyWaterMl: 2500, weeklyWorkouts: 3 } },
];

const fmt = (n, unit) => typeof n === 'number' ? n.toFixed(unit === 'kcal' || unit === 'ml' ? 0 : 1) : n;

export default function NutritionGoals() {
  const [form, setForm] = useState(defaultForm);
  const [progress, setProgress] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('progress');

  const fetchData = async () => {
    try {
      const [goalRes, progressRes] = await Promise.all([apiFetch('/goals'), apiFetch('/goals/progress')]);
      const goal = await goalRes.json();
      const prog = await progressRes.json();
      if (goal) {
        setForm({
          dailyCalories: goal.dailyCalories, dailyProtein: goal.dailyProtein, dailyCarbs: goal.dailyCarbs,
          dailyFat: goal.dailyFat, dailyFiber: goal.dailyFiber, dailyWaterMl: goal.dailyWaterMl,
          weeklyWorkouts: goal.weeklyWorkouts
        });
      }
      setProgress(prog);
    } catch {
      setError('Failed to load goals');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const body = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, Number(v)]));
      const res = await apiFetch('/goals', { method: 'POST', body: JSON.stringify(body) });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed to save');
        return;
      }
      setSaved(true);
      fetchData();
      setTimeout(() => setSaved(false), 2000);
      setActiveTab('progress');
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  const colorFor = (pct) => pct >= 90 ? 'var(--brand)' : pct >= 60 ? 'var(--warn)' : 'var(--cal)';

  return (
    <>
      <PageHeader
        title="Goals"
        subtitle="Set daily targets and see how today is tracking."
        actions={<Tabs value={activeTab} onChange={setActiveTab} tabs={[{ value: 'progress', label: "📊 Today's progress" }, { value: 'settings', label: '⚙️ Set goals' }]} />}
      />
      <Alert>{error}</Alert>
      <Alert type="success">{saved ? 'Goals saved' : ''}</Alert>

      {activeTab === 'progress' && progress && (
        <div className="grid grid-2">
          {progressItems.map(item => {
            const actual = progress[`${item.key}Actual`];
            const goal = progress[`${item.key}Goal`];
            const pct = Number(progress[`${item.key}Percent`]) || 0;
            const remaining = typeof actual === 'number' && typeof goal === 'number' ? goal - actual : null;
            return (
              <Card key={item.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <span style={{ fontWeight: 600 }}>{item.icon} {item.label}</span>
                  <span><b style={{ color: colorFor(pct) }}>{fmt(actual, item.unit)}</b> <span className="muted small">/ {goal} {item.unit}</span></span>
                </div>
                <ProgressBar value={pct} color={colorFor(pct)} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }} className="muted small">
                  <span>{pct >= 100 ? '✅ Goal reached' : `${pct}% complete`}</span>
                  <span>{pct < 100 && remaining !== null ? `${fmt(remaining, item.unit)} ${item.unit} to go` : ''}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'settings' && (
        <Card title="Daily targets">
          <form onSubmit={handleSave} style={{ display: 'grid', gap: 16 }}>
            <div className="form-grid">
              {FIELDS.map(f => (
                <Field key={f.key} label={f.label}>
                  <Input type="number" min="0" value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                </Field>
              ))}
            </div>
            <div>
              <p className="muted small" style={{ marginBottom: 8 }}>Quick presets</p>
              <div className="form-row">
                {PRESETS.map(p => <Button key={p.label} type="button" variant="ghost" size="sm" onClick={() => setForm(p.values)}>{p.label}</Button>)}
              </div>
            </div>
            <Button type="submit" loading={loading}>Save goals</Button>
          </form>
        </Card>
      )}
    </>
  );
}
