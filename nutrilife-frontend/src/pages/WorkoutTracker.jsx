import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { Alert, Badge, Button, Card, EmptyState, Field, Input, PageHeader, Select, Stat, Textarea } from '../components/ui';

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

const categoryColors = { CARDIO: 'var(--cal)', STRENGTH: 'var(--protein)', FLEXIBILITY: 'var(--water)', SPORTS: 'var(--fiber)' };
const categoryIcons = { CARDIO: '🏃', STRENGTH: '💪', FLEXIBILITY: '🧘', SPORTS: '⚽' };
const title = (s) => s ? s.charAt(0) + s.slice(1).toLowerCase() : '';

export default function WorkoutTracker() {
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchSummary = async () => {
    try {
      const res = await apiFetch('/workouts/summary');
      setSummary(await res.json());
    } catch {
      setError('Failed to load workout data');
    }
  };

  useEffect(() => { fetchSummary(); }, []);

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 2000); };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleQuickAdd = async (workout) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/workouts', { method: 'POST', body: JSON.stringify(workout) });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed to log workout');
        return;
      }
      flash(`${workout.exerciseName} logged`);
      fetchSummary();
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
      const res = await apiFetch(editId ? `/workouts/${editId}` : '/workouts', {
        method: editId ? 'PUT' : 'POST',
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
      flash('Workout saved');
      fetchSummary();
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (w) => {
    setEditId(w.id);
    setForm({
      exerciseName: w.exerciseName, category: w.category,
      durationMinutes: w.durationMinutes, caloriesBurned: w.caloriesBurned,
      intensity: w.intensity || 'MEDIUM', sets: w.sets || '', reps: w.reps || '',
      weightKg: w.weightKg || '', notes: w.notes || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workout?')) return;
    await apiFetch(`/workouts/${id}`, { method: 'DELETE' });
    fetchSummary();
  };

  const closeForm = () => { setShowForm(false); setEditId(null); setForm(emptyForm); };
  const workouts = summary?.workouts || [];

  return (
    <>
      <PageHeader
        title="Workouts"
        subtitle="Quick-add a common session or log your own."
        actions={<Button onClick={() => showForm ? closeForm() : setShowForm(true)}>{showForm ? 'Hide form' : '+ Log workout'}</Button>}
      />
      <Alert>{error}</Alert>
      <Alert type="success">{success}</Alert>

      {summary && (
        <div className="grid grid-3 mb">
          <Stat icon="🏋️" label="Workouts today" value={summary.totalWorkouts} color="var(--protein)" />
          <Stat icon="⏱️" label="Total time" value={summary.totalDurationMinutes} unit="min" color="var(--water)" />
          <Stat icon="🔥" label="Calories burned" value={Number(summary.totalCaloriesBurned).toFixed(0)} unit="kcal" color="var(--cal)" />
        </div>
      )}

      {showForm && (
        <Card title={editId ? 'Edit workout' : 'Custom workout'} action={editId && <Badge color="var(--warn)">Editing</Badge>}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
            <div className="form-grid">
              <Field label="Exercise"><Input placeholder="e.g. Deadlift" value={form.exerciseName} onChange={set('exerciseName')} required /></Field>
              <Field label="Category">
                <Select value={form.category} onChange={set('category')}>{CATEGORIES.map(c => <option key={c} value={c}>{title(c)}</option>)}</Select>
              </Field>
              <Field label="Duration (minutes)"><Input type="number" min="1" value={form.durationMinutes} onChange={set('durationMinutes')} required /></Field>
              <Field label="Calories burned"><Input type="number" min="0" value={form.caloriesBurned} onChange={set('caloriesBurned')} /></Field>
              <Field label="Intensity">
                <Select value={form.intensity} onChange={set('intensity')}>{INTENSITIES.map(i => <option key={i} value={i}>{title(i)}</option>)}</Select>
              </Field>
              <Field label="Sets (optional)"><Input type="number" min="0" value={form.sets} onChange={set('sets')} /></Field>
              <Field label="Reps (optional)"><Input type="number" min="0" value={form.reps} onChange={set('reps')} /></Field>
              <Field label="Weight kg (optional)"><Input type="number" min="0" step="0.5" value={form.weightKg} onChange={set('weightKg')} /></Field>
            </div>
            <Field label="Notes (optional)"><Textarea value={form.notes} onChange={set('notes')} /></Field>
            <div className="form-row">
              <Button type="submit" loading={loading} style={{ flex: 1 }}>{editId ? 'Update' : 'Log workout'}</Button>
              <Button type="button" variant="ghost" onClick={closeForm}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <Card title="Quick add">
        <div className="grid grid-actions">
          {QUICK_WORKOUTS.map(w => (
            <button key={w.exerciseName} type="button" className="action" onClick={() => handleQuickAdd(w)} disabled={loading}
              style={{ borderColor: 'var(--border)', cursor: 'pointer' }}>
              <span className="ico">{categoryIcons[w.category]}</span>
              <span className="label">{w.exerciseName}</span>
              <span className="hint">{w.durationMinutes} min · {w.caloriesBurned} kcal</span>
            </button>
          ))}
        </div>
      </Card>

      <Card title="Today's workouts" action={<span className="muted small">{workouts.length} logged</span>}>
        {workouts.length === 0 ? (
          <EmptyState icon="💪" title="No workouts yet" text="Let's get moving — quick-add one above." />
        ) : (
          <div className="list">
            {workouts.map(w => (
              <div key={w.id} className="item accent" style={{ '--item-color': categoryColors[w.category] || 'var(--border)' }}>
                <div style={{ minWidth: 0 }}>
                  <div className="title">
                    {categoryIcons[w.category] || '🏋️'} {w.exerciseName}{' '}
                    <Badge color={categoryColors[w.category]}>{title(w.category)}</Badge>
                    {w.intensity && <span className="muted small"> · {title(w.intensity)} intensity</span>}
                  </div>
                  <div className="meta">
                    <span>⏱️ {w.durationMinutes} min</span>
                    <span>🔥 {w.caloriesBurned} kcal</span>
                    {w.sets > 0 && <span>📊 {w.sets} × {w.reps}</span>}
                    {w.weightKg > 0 && <span>⚖️ {w.weightKg} kg</span>}
                  </div>
                  {w.notes && <div className="note">{w.notes}</div>}
                </div>
                <div className="buttons">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(w)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(w.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
