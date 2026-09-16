import { createContext, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAppStore from '../store/appStore';
import useWebSocket from '../hooks/useWebSocket';

const LiveContext = createContext({ connected: false, nutritionUpdate: null });
export const useLive = () => useContext(LiveContext);

const LINKS = [
  { to: '/dashboard', icon: '🏠', label: 'Home' },
  { to: '/meals', icon: '🥗', label: 'Meals' },
  { to: '/water', icon: '💧', label: 'Water' },
  { to: '/workout', icon: '🏃', label: 'Workouts' },
  { to: '/goals', icon: '🎯', label: 'Goals' },
  { to: '/community', icon: '💬', label: 'Community' },
  { to: '/reports', icon: '🤖', label: 'AI Report' },
];
const MOBILE = ['/dashboard', '/meals', '/water', '/workout', '/reports'];

const initials = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '?';

export default function Layout({ title, children }) {
  const { user, logout } = useAppStore();
  const navigate = useNavigate();
  const live = useWebSocket(user?.email);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;

  return (
    <LiveContext.Provider value={live}>
      <div className="shell">
        <aside className="sidebar">
          <div className="brand"><span className="brand-mark">🌿</span> NutriLife</div>
          <nav className="nav">
            {LINKS.map(l => (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                <span className="ico">{l.icon}</span>{l.label}
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-foot">
            <div className="user-chip">
              <span className="avatar">{initials(user?.name)}</span>
              <div style={{ minWidth: 0 }}>
                <div className="name">{user?.name}</div>
                <div className="email">{user?.email}</div>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm btn-block" style={{ marginTop: 10 }} onClick={handleLogout}>Log out</button>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <span className="title">{title}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={`live ${live.connected ? 'on' : ''}`} title="Live updates over WebSocket">
                <span className="dot" />{live.connected ? 'Live' : 'Offline'}
              </span>
              <button className="btn btn-ghost btn-sm mobile-only" onClick={handleLogout}>Log out</button>
            </div>
          </header>
          <main className="page">{children}</main>
        </div>

        <nav className="bottomnav">
          {LINKS.filter(l => MOBILE.includes(l.to)).map(l => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              <span className="ico">{l.icon}</span>{l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </LiveContext.Provider>
  );
}
