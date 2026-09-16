// Small presentational building blocks shared by every page. Styles live in index.css.

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="sub">{subtitle}</p>}
      </div>
      {actions && <div className="actions">{actions}</div>}
    </div>
  );
}

export function Card({ title, action, children, className = '', style }) {
  return (
    <section className={`card ${className}`} style={style}>
      {(title || action) && (
        <div className="card-head">
          {title && <h3>{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Button({ variant = 'primary', size, block, loading, color, children, className = '', style, ...rest }) {
  const cls = ['btn', `btn-${variant}`, size === 'sm' && 'btn-sm', block && 'btn-block', className].filter(Boolean).join(' ');
  const s = color ? { '--btn-color': color, ...style } : style;
  return (
    <button className={cls} style={s} disabled={loading || rest.disabled} {...rest}>
      {loading && <span className="spinner" />}
      {children}
    </button>
  );
}

export function Field({ label, children }) {
  return (
    <label className="field">
      {label && <span className="label">{label}</span>}
      {children}
    </label>
  );
}

export const Input = (props) => <input className="input" {...props} />;
export const Select = (props) => <select className="select" {...props} />;
export const Textarea = (props) => <textarea className="textarea" {...props} />;

export function Stat({ icon, label, value, unit, color, compact }) {
  return (
    <div className={`stat ${compact ? 'compact' : ''}`} style={{ '--stat-color': color }}>
      {icon && <span className="ico">{icon}</span>}
      <span className="value">{value}{unit && <small>{unit}</small>}</span>
      <span className="label">{label}</span>
    </div>
  );
}

export function ProgressBar({ value, color }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
      <span style={{ width: `${pct}%`, '--bar-color': color }} />
    </div>
  );
}

export function Ring({ value, size = 170, stroke = 14, color, children }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring" style={{ width: size, height: size, '--ring-color': color }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle className="track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        <circle className="val" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      </svg>
      <div className="center">{children}</div>
    </div>
  );
}

export function Alert({ type = 'error', children }) {
  if (!children) return null;
  const icon = type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
  return <div className={`alert ${type}`} role={type === 'error' ? 'alert' : 'status'}><span>{icon}</span><span>{children}</span></div>;
}

export function EmptyState({ icon, title, text, action }) {
  return (
    <div className="empty">
      {icon && <div className="ico">{icon}</div>}
      {title && <h3>{title}</h3>}
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

export function Badge({ color, children }) {
  return <span className="badge" style={{ '--badge-color': color }}>{children}</span>;
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map(t => (
        <button key={t.value} type="button" role="tab" aria-selected={value === t.value}
          className={`tab ${value === t.value ? 'active' : ''}`} onClick={() => onChange(t.value)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Chip({ active, children, ...rest }) {
  return <button type="button" className={`chip ${active ? 'active' : ''}`} {...rest}>{children}</button>;
}

export const fmtTime = (dt) => dt ? new Date(dt).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }) : '';
export const fmtDate = (dt) => dt ? new Date(dt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
