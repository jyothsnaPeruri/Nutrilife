import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultForm = {
  dailyCalories: 2000,
  dailyProtein: 50,
  dailyCarbs: 250,
  dailyFat: 65,
  dailyFiber: 25,
  dailyWaterMl: 2500,
  weeklyWorkouts: 5
};

const progressItems = [
  { key: 'calorie', label: 'Calories', unit: 'kcal', color: '#FF6B6B', icon: '🔥' },
  { key: 'protein', label: 'Protein', unit: 'g', color: '#4ECDC4', icon: '💪' },
  { key: 'carbs', label: 'Carbs', unit: 'g', color: '#45B7D1', icon: '🍞' },
  { key: 'fat', label: 'Fat', unit: 'g', color: '#96CEB4', icon: '🧈' },
  { key: 'fiber', label: 'Fiber', unit: 'g', color: '#FFEAA7', icon: '🌾' },
  { key: 'water', label: 'Water', unit: 'ml', color: '#2196F3', icon: '💧' },
  { key: 'workout', label: 'Workouts', unit: 'this week', color: '#9C27B0', icon: '🏋️' },
];

export default function NutritionGoals() {
  const [form, setForm] = useState(defaultForm);
  const [progress, setProgress] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('progress');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const fetchData = async () => {
    try {
      const [goalRes, progressRes] = await Promise.all([
        fetch('http://localhost:8080/api/goals', { headers }),
        fetch('http://localhost:8080/api/goals/progress', { headers })
      ]);
      const goal = await goalRes.json();
      const prog = await progressRes.json();
      if (goal) {
        setForm({
          dailyCalories: goal.dailyCalories,
          dailyProtein: goal.dailyProtein,
          dailyCarbs: goal.dailyCarbs,
          dailyFat: goal.dailyFat,
          dailyFiber: goal.dailyFiber,
          dailyWaterMl: goal.dailyWaterMl,
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
      const res = await fetch('http://localhost:8080/api/goals', {
        method: 'POST', headers,
        body: JSON.stringify({
          ...form,
          dailyCalories: Number(form.dailyCalories),
          dailyProtein: Number(form.dailyProtein),
          dailyCarbs: Number(form.dailyCarbs),
          dailyFat: Number(form.dailyFat),
          dailyFiber: Number(form.dailyFiber),
          dailyWaterMl: Number(form.dailyWaterMl),
          weeklyWorkouts: Number(form.weeklyWorkouts)
        })
      });
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

  const getColor = (pct) => {
    if (pct >= 90) return '#4CAF50';
    if (pct >= 60) return '#FF9800';
    return '#FF5722';
  };

  const inp = {
    padding: '8px 10px', borderRadius: 6,
    border: '1px solid #ddd', width: '100%',
    boxSizing: 'border-box', fontSize: 14
  };

  return (
    <div style={{ maxWidth: 800, margin: '30px auto', padding: '0 16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>🎯 Nutrition Goals</h2>
        <button onClick={() => navigate('/dashboard')}
          style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}>
          ← Dashboard
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '2px solid #eee' }}>
        {['progress', 'settings'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 24px', border: 'none', background: 'none',
              cursor: 'pointer', fontWeight: activeTab === tab ? 600 : 400,
              borderBottom: activeTab === tab ? '2px solid #4CAF50' : '2px solid transparent',
              marginBottom: -2, color: activeTab === tab ? '#4CAF50' : '#666',
              textTransform: 'capitalize', fontSize: 14
            }}>
            {tab === 'progress' ? '📊 Today\'s Progress' : '⚙️ Set Goals'}
          </button>
        ))}
      </div>

      {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
      {saved && <p style={{ color: '#4CAF50', fontWeight: 600, marginBottom: 12 }}>✅ Goals saved successfully!</p>}

      {/* Progress Tab */}
      {activeTab === 'progress' && progress && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {progressItems.map(item => {
            const actual = progress[`${item.key}Actual`];
            const goal = progress[`${item.key}Goal`];
            const pct = progress[`${item.key}Percent`];
            const color = getColor(pct);
            return (
              <div key={item.key} style={{
                background: '#fff', border: '1px solid #eee',
                borderRadius: 12, padding: '16px 18px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <span style={{ fontWeight: 600 }}>{item.label}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 700, color }}>
                      {typeof actual === 'number' ? actual.toFixed(item.unit === 'kcal' || item.unit === 'ml' ? 0 : 1) : actual}
                    </span>
                    <span style={{ color: '#aaa', fontSize: 13 }}>
                      {' '}/ {goal} {item.unit}
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ background: '#f0f0f0', borderRadius: 10, height: 10, overflow: 'hidden' }}>
                  <div style={{
                    width: `${pct}%`, height: '100%',
                    background: color, borderRadius: 10,
                    transition: 'width 0.5s ease'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: '#aaa' }}>
                    {pct >= 100 ? '✅ Goal reached!' : `${pct}% complete`}
                  </span>
                  <span style={{ fontSize: 11, color: '#aaa' }}>
                    {pct < 100 ? `${(goal - actual).toFixed(item.unit === 'kcal' || item.unit === 'ml' ? 0 : 1)} ${item.unit} remaining` : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 24 }}>
          <h3 style={{ margin: '0 0 20px' }}>Set your daily targets</h3>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: '🔥 Daily Calories (kcal)', key: 'dailyCalories' },
                { label: '💪 Daily Protein (g)', key: 'dailyProtein' },
                { label: '🍞 Daily Carbs (g)', key: 'dailyCarbs' },
                { label: '🧈 Daily Fat (g)', key: 'dailyFat' },
                { label: '🌾 Daily Fiber (g)', key: 'dailyFiber' },
                { label: '💧 Daily Water (ml)', key: 'dailyWaterMl' },
                { label: '🏋️ Weekly Workouts', key: 'weeklyWorkouts' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: 13, color: '#555', marginBottom: 6 }}>
                    {field.label}
                  </label>
                  <input type="number" style={inp} min="0"
                    value={form[field.key]}
                    onChange={e => setForm({...form, [field.key]: e.target.value})} />
                </div>
              ))}
            </div>

            {/* Preset buttons */}
            <div style={{ marginTop: 20, marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: '#888', marginBottom: 10 }}>Quick presets:</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { label: '⚖️ Weight loss', values: { dailyCalories: 1500, dailyProtein: 120, dailyCarbs: 150, dailyFat: 50, dailyFiber: 30, dailyWaterMl: 3000, weeklyWorkouts: 5 } },
                  { label: '💪 Muscle gain', values: { dailyCalories: 2800, dailyProtein: 180, dailyCarbs: 300, dailyFat: 80, dailyFiber: 25, dailyWaterMl: 3500, weeklyWorkouts: 6 } },
                  { label: '🧘 Maintenance', values: { dailyCalories: 2000, dailyProtein: 80, dailyCarbs: 250, dailyFat: 65, dailyFiber: 25, dailyWaterMl: 2500, weeklyWorkouts: 3 } },
                ].map(preset => (
                  <button key={preset.label} type="button"
                    onClick={() => setForm(preset.values)}
                    style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer', fontSize: 13 }}>
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: 12, background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15, fontWeight: 600 }}>
              {loading ? 'Saving...' : '💾 Save Goals'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}