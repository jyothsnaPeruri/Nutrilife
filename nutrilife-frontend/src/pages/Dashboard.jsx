import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/appStore';
import useWebSocket from '../hooks/useWebSocket';

export default function Dashboard() {
  const { user, logout } = useAppStore();
  const navigate = useNavigate();
  const { connected, nutritionUpdate } = useWebSocket(user?.email);
  const [stats, setStats] = useState({
    calories: 0, meals: 0, water: 0, workouts: 0
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Load initial stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [mealRes, waterRes, workoutRes] = await Promise.all([
          fetch('http://localhost:8080/api/meals/summary', { headers }),
          fetch('http://localhost:8080/api/water/summary', { headers }),
          fetch('http://localhost:8080/api/workouts/summary', { headers })
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
      } catch (e) {
        console.error(e);
      }
    };
    if (token) fetchStats();
  }, []);

  // Live update from WebSocket
  useEffect(() => {
    if (nutritionUpdate) {
      setStats(prev => ({
        ...prev,
        calories: nutritionUpdate.totalCalories || prev.calories,
        meals: nutritionUpdate.totalMeals || prev.meals,
        water: nutritionUpdate.totalWaterMl || prev.water,
        workouts: nutritionUpdate.totalWorkouts || prev.workouts
      }));
    }
  }, [nutritionUpdate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

const actions = [
  { label: 'Log a Meal', icon: '🥗', path: '/meals' },
  { label: 'Track Water', icon: '💧', path: '/water' },
  { label: 'Log Workout', icon: '🏃', path: '/workout' },
  { label: 'Community', icon: '💬', path: '/community' },
  { label: 'My Goals', icon: '🎯', path: '/goals' },
  { label: 'AI Report', icon: '🤖', path: '/reports' },
];
  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0 }}>🥗 NutriLife</h1>
          <p style={{ margin: 0, color: '#666' }}>Welcome back, {user?.name}!</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontSize: 12, padding: '4px 10px', borderRadius: 20,
            background: connected ? '#f0fff0' : '#fff5f5',
            color: connected ? '#4CAF50' : '#e53935',
            border: `1px solid ${connected ? '#4CAF50' : '#e53935'}`
          }}>
            {connected ? '🟢 Live' : '🔴 Offline'}
          </span>
          <button onClick={handleLogout}
            style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: 6, border: '1px solid #ddd' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Live Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Calories Today', value: `${stats.calories.toFixed(0)} kcal`, icon: '🔥', color: '#FF6B6B' },
          { label: 'Water Intake', value: `${stats.water} ml`, icon: '💧', color: '#2196F3' },
          { label: 'Meals Logged', value: stats.meals, icon: '🍽️', color: '#4CAF50' },
          { label: 'Workouts', value: stats.workouts, icon: '💪', color: '#9C27B0' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: '#fff', borderRadius: 12,
            padding: '20px 16px', textAlign: 'center',
            border: '1px solid #eee',
            boxShadow: connected ? `0 0 0 1px ${stat.color}22` : 'none',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: 28 }}>{stat.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 600, margin: '8px 0 4px', color: stat.color }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 13, color: '#888' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h3 style={{ marginBottom: 16 }}>Quick Actions</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {actions.map((action) => (
          <div key={action.label}
            onClick={() => navigate(action.path)}
            style={{
              background: '#fff', border: '1px solid #ddd',
              borderRadius: 10, padding: '16px 12px',
              textAlign: 'center', cursor: 'pointer',
              transition: 'border-color .2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#4CAF50'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#ddd'}
          >
            <div style={{ fontSize: 26 }}>{action.icon}</div>
            <div style={{ fontSize: 13, marginTop: 8, fontWeight: 500 }}>{action.label}</div>
          </div>
        ))}
      </div>

      {/* User Info */}
      <div style={{ marginTop: 32, padding: 16, background: '#f0f7f0', borderRadius: 10 }}>
        <p style={{ margin: 0, fontSize: 13, color: '#555' }}>
          Logged in as <strong>{user?.email}</strong> · Role: <strong>{user?.role}</strong>
        </p>
      </div>
    </div>
  );
}