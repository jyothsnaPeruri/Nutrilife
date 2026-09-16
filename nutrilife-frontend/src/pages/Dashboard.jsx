import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAppStore from '../store/appStore';
import { useLive } from '../components/Layout';
import { apiFetch } from '../services/api';
import { Alert, Card, Stat } from '../components/ui';

const ACTIONS = [
  { label: 'Log a meal', hint: 'Calories & macros', icon: '🥗', path: '/meals' },
  { label: 'Track water', hint: 'Quick add', icon: '💧', path: '/water' },
  { label: 'Log workout', hint: 'Cardio, strength…', icon: '🏃', path: '/workout' },
  { label: 'My goals', hint: 'Targets & progress', icon: '🎯', path: '/goals' },
  { label: 'Community', hint: 'Chat rooms', icon: '💬', path: '/community' },
  { label: 'AI report', hint: 'Weekly coaching', icon: '🤖', path: '/reports' },
];

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

export default function Dashboard() {
  const { user } = useAppStore();
  const { connected, nutritionUpdate } = useLive();
  const [stats, setStats] = useState({ calories: 0, meals: 0, water: 0, workouts: 0 });
  const [error, setError] = useState('');

  // Load initial stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [mealRes, waterRes, workoutRes] = await Promise.all([
          apiFetch('/meals/summary'),
          apiFetch('/water/summary'),
          apiFetch('/workouts/summary')
        ]);
        const meal = await mealRes.json();
        const water = await waterRes.json();
        const workout = await workoutRes.json();
        setStats({
          calories: meal.totalCalories || 0,
          meals: meal.totalMeals || 0,
          water: water.totalMl || 0,
          workouts: workout.totalWorkouts || 0
        });
      } catch {
        setError('Could not load today\'s numbers. Is the backend running?');
      }
    };
    fetchStats();
  }, []);

  // Live update from WebSocket
  useEffect(() => {
    if (nutritionUpdate) {
      setStats(prev => ({
        ...prev,
        calories: nutritionUpdate.totalCalories ?? prev.calories,
        meals: nutritionUpdate.totalMeals ?? prev.meals,
        water: nutritionUpdate.totalWaterMl ?? prev.water,
        workouts: nutritionUpdate.totalWorkouts ?? prev.workouts
      }));
    }
  }, [nutritionUpdate]);

  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
          <p className="sub">{today} · {connected ? 'numbers update live as you log' : 'reconnecting to live updates…'}</p>
        </div>
      </div>

      <Alert>{error}</Alert>

      <div className="grid grid-auto mb">
        <Stat icon="🔥" label="Calories today" value={Number(stats.calories).toFixed(0)} unit="kcal" color="var(--cal)" />
        <Stat icon="💧" label="Water" value={stats.water} unit="ml" color="var(--water)" />
        <Stat icon="🍽️" label="Meals logged" value={stats.meals} color="var(--brand)" />
        <Stat icon="💪" label="Workouts" value={stats.workouts} color="var(--workout)" />
      </div>

      <Card title="Quick actions">
        <div className="grid grid-actions">
          {ACTIONS.map(a => (
            <Link key={a.path} to={a.path} className="action">
              <span className="ico">{a.icon}</span>
              <span className="label">{a.label}</span>
              <span className="hint">{a.hint}</span>
            </Link>
          ))}
        </div>
      </Card>
    </>
  );
}
