import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['CARDIO', 'STRENGTH', 'FLEXIBILITY', 'SPORTS'];
const INTENSITIES = ['LOW', 'MEDIUM', 'HIGH'];

const QUICK_WORKOUTS = [
  { exerciseName: 'Running', category: 'CARDIO', durationMinutes: 30, caloriesBurned: 300, intensity: 'MEDIUM' },
  { exerciseName: 'Walking', category: 'CARDIO', durationMinutes: 45, caloriesBurned: 180, intensity: 'LOW' },
  { exerciseName: 'Cycling', category: 'CARDIO', durationMinutes: 30, caloriesBurned: 250, intensity: 'MEDIUM' },
  { exerciseName: 'Push-ups', category: 'STRENGTH', durationMinutes: 15, caloriesBurned: 100, intensity: 'MEDIUM' },
  { exerciseName: 'Yoga', category: 'FLEXIBILITY', durationMinutes: 45, caloriesBurned: 150, intensity: 'LOW' },
  { exerciseName: 'Swimming', category: 'CARDIO', durationMinutes: 30, caloriesBurned: 350, intensity: 'HIGH' },
];

const emptyForm = {
  exerciseName: '', category: 'CARDIO',
  durationMinutes: '', caloriesBurned: '',
  intensity: 'MEDIUM', sets: '', reps: '',
  weightKg: '', notes: ''
};

const categoryColors = {
  CARDIO: '#FF6B6B',
  STRENGTH: '#4ECDC4',
  FLEXIBILITY: '#45B7D1',
  SPORTS: '#96CEB4'
};

const categoryIcons = {
  CARDIO: '🏃',
  STRENGTH: '💪',
  FLEXIBILITY: '🧘',
  SPORTS: '⚽'
};

export default function WorkoutTracker() {
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/workouts/summary', { headers });
      const data = await res.json();
      setSummary(data);
    } catch {
      setError('Failed to load workout data');
    }
  };

  useEffect(() => { fetchSummary(); }, []);

  const handleQuickAdd = async (workout) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/workouts', {
        method: 'POST', headers,
        body: JSON.stringify(workout)
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed to log workout');
        return;
      }
      setSuccess(`${workout.exerciseName} logged!`);
      fetchSummary();
      setTimeout(() => setSuccess(''), 2000);
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = editId
        ? `http://localhost:8080/api/workouts/${editId}`
        : 'http://localhost:8080/api/workouts';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers,
        body: JSON.stringify({
          ...form,
          durationMinutes: Number(form.durationMinutes),
          caloriesBurned: Number(form.caloriesBurned),
          sets: Number(form.sets) || 0,
          reps: Number(form.reps) || 0,
          weightKg: Number(form.weightKg) || 0
        })
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed to save');
        return;
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      setSuccess('Workout logged successfully!');
      fetchSummary();
      setTimeout(() => setSuccess(''), 2000);
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (w) => {
    setEditId(w.id);
    setForm({
      exerciseName: w.exerciseName,
      category: w.category,
      durationMinutes: w.durationMinutes,
      caloriesBurned: w.caloriesBurned,
      intensity: w.intensity || 'MEDIUM',
      sets: w.sets || '',
      reps: w.reps || '',
      weightKg: w.weightKg || '',
      notes: w.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workout?')) return;
    await fetch(`http://localhost:8080/api/workouts/${id}`, {
      method: 'DELETE', headers
    });
    fetchSummary();
  };

  const inp = {
    padding: '8px 10px', borderRadius: 6,
    border: '1px solid #ddd', width: '100%',
    boxSizing: 'border-box', marginBottom: 10,
    fontSize: 14
  };

  return (
    <div style={{ maxWidth: 900, margin: '30px auto', padding: '0 16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>💪 Workout Tracker</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
            style={{ padding: '8px 16px', borderRadius: 6, background: '#4CAF50', color: '#fff', border: 'none', cursor: 'pointer' }}>
            {showForm ? 'Hide form' : '+ Log workout'}
          </button>
          <button onClick={() => navigate('/dashboard')}
            style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}>
            ← Dashboard
          </button>
        </div>
      </div>

      {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
      {success && <p style={{ color: '#4CAF50', fontWeight: 600, marginBottom: 12 }}>{success}</p>}

      {/* Summary Cards */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Workouts today', value: summary.totalWorkouts, icon: '🏋️', color: '#4ECDC4' },
            { label: 'Total duration', value: `${summary.totalDurationMinutes} min`, icon: '⏱️', color: '#45B7D1' },
            { label: 'Calories burned', value: `${summary.totalCaloriesBurned.toFixed(0)} kcal`, icon: '🔥', color: '#FF6B6B' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: '18px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 26 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, margin: '6px 0 4px' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Add */}
      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 18, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 14px' }}>⚡ Quick Add</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
          {QUICK_WORKOUTS.map(w => (
            <button key={w.exerciseName} onClick={() => handleQuickAdd(w)} disabled={loading}
              style={{
                padding: '12px 8px', borderRadius: 8,
                border: `1.5px solid ${categoryColors[w.category]}`,
                background: '#fff', cursor: 'pointer',
                textAlign: 'center'
              }}>
              <div style={{ fontSize: 20 }}>{categoryIcons[w.category]}</div>
              <div style={{ fontSize: 13, fontWeight: 600, margin: '4px 0 2px' }}>{w.exerciseName}</div>
              <div style={{ fontSize: 11, color: '#888' }}>{w.durationMinutes}min · {w.caloriesBurned}kcal</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Log Form */}
      {showForm && (
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 16px' }}>{editId ? '✏️ Edit Workout' : '➕ Custom Workout'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input style={inp} placeholder="Exercise name" value={form.exerciseName}
                onChange={e => setForm({...form, exerciseName: e.target.value})} required />
              <select style={inp} value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <input style={inp} type="number" placeholder="Duration (minutes)"
                value={form.durationMinutes}
                onChange={e => setForm({...form, durationMinutes: e.target.value})} required min="1" />
              <input style={inp} type="number" placeholder="Calories burned"
                value={form.caloriesBurned}
                onChange={e => setForm({...form, caloriesBurned: e.target.value})} min="0" />
              <select style={inp} value={form.intensity}
                onChange={e => setForm({...form, intensity: e.target.value})}>
                {INTENSITIES.map(i => <option key={i}>{i}</option>)}
              </select>
              <input style={inp} type="number" placeholder="Sets (optional)"
                value={form.sets}
                onChange={e => setForm({...form, sets: e.target.value})} min="0" />
              <input style={inp} type="number" placeholder="Reps (optional)"
                value={form.reps}
                onChange={e => setForm({...form, reps: e.target.value})} min="0" />
              <input style={inp} type="number" placeholder="Weight kg (optional)"
                value={form.weightKg}
                onChange={e => setForm({...form, weightKg: e.target.value})} min="0" />
            </div>
            <textarea style={{...inp, height: 60, resize: 'vertical'}} placeholder="Notes (optional)"
              value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" disabled={loading}
                style={{ flex: 1, padding: 10, background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                {loading ? 'Saving...' : editId ? 'Update' : 'Log Workout'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }}
                style={{ padding: '10px 16px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Today's Workouts */}
      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 20 }}>
        <h3 style={{ margin: '0 0 16px' }}>📋 Today's Workouts</h3>
        {summary?.workouts?.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', padding: 20 }}>
            No workouts logged today. Let's get moving! 💪
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {summary?.workouts?.map(w => (
              <div key={w.id} style={{
                border: '1px solid #f0f0f0', borderRadius: 10, padding: 14,
                borderLeft: `4px solid ${categoryColors[w.category] || '#ddd'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{categoryIcons[w.category] || '🏋️'}</span>
                    <div>
                      <span style={{ fontWeight: 600 }}>{w.exerciseName}</span>
                      <span style={{ marginLeft: 8, fontSize: 11, padding: '2px 8px', borderRadius: 10,
                        background: `${categoryColors[w.category]}22`,
                        color: categoryColors[w.category] }}>
                        {w.category}
                      </span>
                      {w.intensity && (
                        <span style={{ marginLeft: 6, fontSize: 11, color: '#888' }}>· {w.intensity}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => handleEdit(w)}
                      style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #ddd', cursor: 'pointer', fontSize: 12 }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(w.id)}
                      style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #ffcccc',
                        color: '#e53935', background: '#fff5f5', cursor: 'pointer', fontSize: 12 }}>
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12, color: '#666' }}>
                  <span>⏱️ {w.durationMinutes} min</span>
                  <span>🔥 {w.caloriesBurned} kcal</span>
                  {w.sets > 0 && <span>📊 {w.sets} sets × {w.reps} reps</span>}
                  {w.weightKg > 0 && <span>⚖️ {w.weightKg} kg</span>}
                </div>
                {w.notes && <p style={{ margin: '6px 0 0', fontSize: 12, color: '#aaa' }}>{w.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}