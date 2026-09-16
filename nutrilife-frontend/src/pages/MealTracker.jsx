import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { Alert, Badge, Button, Card, EmptyState, Field, Input, PageHeader, Select, Stat, Textarea } from '../components/ui';

const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
const TYPE_LABEL = { BREAKFAST: 'Breakfast', LUNCH: 'Lunch', DINNER: 'Dinner', SNACK: 'Snack' };
const TYPE_ICON = { BREAKFAST: '🌅', LUNCH: '☀️', DINNER: '🌙', SNACK: '🍎' };

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

  const fetchData = async () => {
    try {
      const [mealsRes, summaryRes] = await Promise.all([apiFetch('/meals/today'), apiFetch('/meals/summary')]);
      const m = await mealsRes.json();
      setMeals(Array.isArray(m) ? m : []);
      setSummary(await summaryRes.json());
    } catch {
      setError('Could not load meals');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(editId ? `/meals/${editId}` : '/meals', {
        method: editId ? 'PUT' : 'POST',
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
      mealName: meal.mealName, mealType: meal.mealType,
      calories: meal.calories, protein: meal.protein, carbs: meal.carbs,
      fat: meal.fat, fiber: meal.fiber, notes: meal.notes || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this meal?')) return;
    await apiFetch(`/meals/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const cancelEdit = () => { setEditId(null); setForm(emptyForm); };

  return (
    <>
      <PageHeader title="Meals" subtitle="Log what you eat and watch your macros add up." />
      <Alert>{error}</Alert>

      {summary && (
        <div className="grid grid-auto mb">
          <Stat compact label="Calories" value={Number(summary.totalCalories).toFixed(0)} unit="kcal" color="var(--cal)" />
          <Stat compact label="Protein" value={Number(summary.totalProtein).toFixed(1)} unit="g" color="var(--protein)" />
          <Stat compact label="Carbs" value={Number(summary.totalCarbs).toFixed(1)} unit="g" color="var(--carbs)" />
          <Stat compact label="Fat" value={Number(summary.totalFat).toFixed(1)} unit="g" color="var(--fat)" />
          <Stat compact label="Fibre" value={Number(summary.totalFiber).toFixed(1)} unit="g" color="var(--fiber)" />
          <Stat compact label="Meals" value={summary.totalMeals} color="var(--brand)" />
        </div>
      )}

      <div className="grid grid-2">
        <Card title={editId ? 'Edit meal' : 'Log a meal'} action={editId && <Badge color="var(--warn)">Editing</Badge>}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
            <Field label="Meal name">
              <Input placeholder="e.g. Oats with banana" value={form.mealName} onChange={set('mealName')} required />
            </Field>
            <Field label="Type">
              <Select value={form.mealType} onChange={set('mealType')}>
                {MEAL_TYPES.map(t => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
              </Select>
            </Field>
            <div className="form-grid">
              <Field label="Calories (kcal)"><Input type="number" min="0" value={form.calories} onChange={set('calories')} required /></Field>
              <Field label="Protein (g)"><Input type="number" min="0" step="0.1" value={form.protein} onChange={set('protein')} /></Field>
              <Field label="Carbs (g)"><Input type="number" min="0" step="0.1" value={form.carbs} onChange={set('carbs')} /></Field>
              <Field label="Fat (g)"><Input type="number" min="0" step="0.1" value={form.fat} onChange={set('fat')} /></Field>
              <Field label="Fibre (g)"><Input type="number" min="0" step="0.1" value={form.fiber} onChange={set('fiber')} /></Field>
            </div>
            <Field label="Notes (optional)">
              <Textarea placeholder="Anything worth remembering" value={form.notes} onChange={set('notes')} />
            </Field>
            <div className="form-row">
              <Button type="submit" loading={loading} style={{ flex: 1 }}>{editId ? 'Update meal' : 'Log meal'}</Button>
              {editId && <Button type="button" variant="ghost" onClick={cancelEdit}>Cancel</Button>}
            </div>
          </form>
        </Card>

        <Card title="Today's meals" action={<span className="muted small">{meals.length} logged</span>}>
          {meals.length === 0 ? (
            <EmptyState icon="🍽️" title="Nothing logged yet" text="Your first meal of the day goes here." />
          ) : (
            <div className="list scroll">
              {meals.map(meal => (
                <div key={meal.id} className="item">
                  <div style={{ minWidth: 0 }}>
                    <div className="title">{TYPE_ICON[meal.mealType]} {meal.mealName} <Badge>{TYPE_LABEL[meal.mealType] || meal.mealType}</Badge></div>
                    <div className="meta">
                      <span>🔥 {meal.calories} kcal</span>
                      <span>💪 {meal.protein}g protein</span>
                      <span>🍞 {meal.carbs}g carbs</span>
                      <span>🧈 {meal.fat}g fat</span>
                    </div>
                    {meal.notes && <div className="note">{meal.notes}</div>}
                  </div>
                  <div className="buttons">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(meal)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(meal.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
