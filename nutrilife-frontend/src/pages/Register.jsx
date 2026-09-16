import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAppStore from '../store/appStore';
import { apiFetch } from '../services/api';
import { Alert, Button, Field, Input } from '../components/ui';
import AuthSide from '../components/AuthSide';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Registration failed');
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

  return (
    <div className="auth">
      <AuthSide />
      <div className="auth-form">
        <div className="auth-card">
          <div className="brand" style={{ padding: 0 }}><span className="brand-mark">🌿</span> NutriLife</div>
          <h1>Create your account</h1>
          <p className="sub">Free, and it takes 20 seconds.</p>
          <Alert>{error}</Alert>
          <form onSubmit={handleSubmit}>
            <Field label="Full name">
              <Input placeholder="Jo Peruri" value={form.name} autoComplete="name"
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </Field>
            <Field label="Email">
              <Input type="email" placeholder="you@example.com" value={form.email} autoComplete="email"
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </Field>
            <Field label="Password">
              <Input type="password" placeholder="At least 6 characters" value={form.password} autoComplete="new-password"
                onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </Field>
            <Button type="submit" block loading={loading}>{loading ? 'Creating account…' : 'Create account'}</Button>
          </form>
          <p className="mt muted small">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
