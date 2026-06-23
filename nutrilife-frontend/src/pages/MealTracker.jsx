import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];

const emptyForm = {
  mealName: '', mealType: 'BREAKFAST',
  calories: '', protein: '', carbs: '',
  fat: '', fiber: '', notes: ''
};

export default function MealTracker() {
  const [meals, setMeals] = useState([]);
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const fetchData = async () => {
    const [mealsRes, summaryRes] = await Promise.all([
      fetch('http://localhost:8080/api/meals/today', { headers }),
      fetch('http://localhost:8080/api/meals/summary', { headers })
    ]);
    setMeals(await mealsRes.json());
    setSummary(await summaryRes.json());
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = editId
        ? `http://localhost:8080/api/meals/${editId}`
        : 'http://localhost:8080/api/meals';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers,
        body: JSON.stringify({
          ...form,
          calories: Number(form.calories),
          protein: Number(form.protein),
          carbs: Number(form.carbs),
          fat: Number(form.fat),
          fiber: Number(form.fiber)
        })
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed to save meal');
        return;
      }
      setForm(emptyForm);
      setEditId(null);
      fetchData();
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (meal) => {
    setEditId(meal.id);
    setForm({
      mealName: meal.mealName,
      mealType: meal.mealType,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      fiber: meal.fiber,
      notes: meal.notes || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this meal?')) return;
    await fetch(`http://localhost:8080/api/meals/${id}`, {
      method: 'DELETE', headers
    });
    fetchData();
  };

  const inp = {
    padding: '8px 10px', borderRadius: 6,
    border: '1px solid #ddd', width: '100%',
    boxSizing: 'border-box', marginBottom: 10
  };

  return (
    <div style={{ maxWidth: 900, margin: '30px auto', padding: '0 16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>🥗 Meal Tracker</h2>
        <button onClick={() => navigate('/dashboard')}
          style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}>
          ← Dashboard
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Calories', value: summary.totalCalories.toFixed(0), unit: 'kcal', color: '#FF6B6B' },
            { label: 'Protein', value: summary.totalProtein.toFixed(1), unit: 'g', color: '#4ECDC4' },
            { label: 'Carbs', value: summary.totalCarbs.toFixed(1), unit: 'g', color: '#45B7D1' },
            { label: 'Fat', value: summary.totalFat.toFixed(1), unit: 'g', color: '#96CEB4' },
            { label: 'Fiber', value: summary.totalFiber.toFixed(1), unit: 'g', color: '#FFEAA7' },
            { label: 'Meals', value: summary.totalMeals, unit: 'logged', color: '#DDA0DD' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#aaa' }}>{s.unit}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Log Meal Form */}
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px' }}>{editId ? '✏️ Edit Meal' : '➕ Log a Meal'}</h3>
          {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <input style={inp} placeholder="Meal name (e.g. Oatmeal)"
              value={form.mealName} onChange={e => setForm({...form, mealName: e.target.value})} required />
            <select style={inp} value={form.mealType}
              onChange={e => setForm({...form, mealType: e.target.value})}>
              {MEAL_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <input style={inp} type="number" placeholder="Calories (kcal)"
                value={form.calories} onChange={e => setForm({...form, calories: e.target.value})} required min="0" />
              <input style={inp} type="number" placeholder="Protein (g)"
                value={form.protein} onChange={e => setForm({...form, protein: e.target.value})} min="0" />
              <input style={inp} type="number" placeholder="Carbs (g)"
                value={form.carbs} onChange={e => setForm({...form, carbs: e.target.value})} min="0" />
              <input style={inp} type="number" placeholder="Fat (g)"
                value={form.fat} onChange={e => setForm({...form, fat: e.target.value})} min="0" />
              <input style={inp} type="number" placeholder="Fiber (g)"
                value={form.fiber} onChange={e => setForm({...form, fiber: e.target.value})} min="0" />
            </div>
            <textarea style={{...inp, height: 60, resize: 'vertical'}} placeholder="Notes (optional)"
              value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" disabled={loading}
                style={{ flex: 1, padding: 10, background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                {loading ? 'Saving...' : editId ? 'Update Meal' : 'Log Meal'}
              </button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setForm(emptyForm); }}
                  style={{ padding: '10px 16px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Today's Meals List */}
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px' }}>📋 Today's Meals</h3>
          {meals.length === 0 ? (
            <p style={{ color: '#aaa', textAlign: 'center', marginTop: 40 }}>No meals logged today yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 400, overflowY: 'auto' }}>
              {meals.map(meal => (
                <div key={meal.id} style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{meal.mealName}</span>
                      <span style={{ marginLeft: 8, fontSize: 11, background: '#f0f7f0', color: '#4CAF50', padding: '2px 8px', borderRadius: 10 }}>
                        {meal.mealType}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleEdit(meal)}
                        style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #ddd', cursor: 'pointer', fontSize: 12 }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(meal.id)}
                        style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #ffcccc', color: '#e53935', background: '#fff5f5', cursor: 'pointer', fontSize: 12 }}>
                        Delete
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 12, color: '#888' }}>
                    <span>🔥 {meal.calories} kcal</span>
                    <span>💪 {meal.protein}g protein</span>
                    <span>🍞 {meal.carbs}g carbs</span>
                    <span>🧈 {meal.fat}g fat</span>
                  </div>
                  {meal.notes && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#aaa' }}>{meal.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}