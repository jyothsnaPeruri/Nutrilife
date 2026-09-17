import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAppStore from '../store/appStore';
import { apiFetch } from '../services/api';
import { Alert, Button, Field, Input } from '../components/ui';
import AuthSide from '../components/AuthSide';
import useServerWake from '../hooks/useServerWake';

const DEMO = { email: 'demo@nutrilife.dev', password: 'Demo@1234' };

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAppStore();
  const navigate = useNavigate();
  const server = useServerWake();

  const signIn = async (credentials) => {
    setLoading(true);
    setError('');
    try {
      const response = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      login({ name: data.name, email: data.email, role: data.role }, data.token);
      navigate('/dashboard');
    } catch {
      setError('Cannot connect to the server. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(form);
  };

  const tryDemo = () => {
    setForm(DEMO);
    signIn(DEMO);
  };

  return (
    <div className="auth">
      <AuthSide />
      <div className="auth-form">
        <div className="auth-card">
          <div className="brand" style={{ padding: 0 }}><span className="brand-mark">🌿</span> NutriLife</div>
          <h1>Welcome back</h1>
          <p className="sub">Sign in to see today's progress.</p>
          {server === 'waking' && <div className="wake"><span className="spinner" /> Waking up the server — free hosting sleeps when idle, this can take up to a minute.</div>}
          {server === 'woke' && <div className="wake ready">✓ Server is awake.</div>}
          <Alert>{error}</Alert>
          <Button type="button" variant="ghost" block onClick={tryDemo} disabled={loading}>🌿 Try the demo account</Button>
          <div className="divider">or sign in</div>
          <form onSubmit={handleSubmit}>
            <Field label="Email">
              <Input type="email" placeholder="you@example.com" value={form.email} autoComplete="email"
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </Field>
            <Field label="Password">
              <Input type="password" placeholder="••••••••" value={form.password} autoComplete="current-password"
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </Field>
            <Button type="submit" block loading={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>
          </form>
          <p className="mt muted small">No account? <Link to="/register">Create one</Link></p>
        </div>
      </div>
    </div>
  );
}
