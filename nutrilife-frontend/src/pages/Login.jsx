import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAppStore from '../store/appStore';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      login({ name: data.name, email: data.email, role: data.role }, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Cannot connect to server. Is Spring Boot running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 16px' }}>
      <h2 style={{ marginBottom: 8 }}>🥗 NutriLife</h2>
      <h3 style={{ marginBottom: 24, fontWeight: 400 }}>Welcome back</h3>
      {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
          required
          style={{ display: 'block', width: '100%', marginBottom: 12, padding: 10, boxSizing: 'border-box', borderRadius: 6, border: '1px solid #ddd' }} />
        <input type="password" placeholder="Password" value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
          required
          style={{ display: 'block', width: '100%', marginBottom: 16, padding: 10, boxSizing: 'border-box', borderRadius: 6, border: '1px solid #ddd' }} />
        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: 10, background: '#4CAF50', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 15 }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: 16 }}>No account? <Link to="/register">Sign up</Link></p>
    </div>
  );
}