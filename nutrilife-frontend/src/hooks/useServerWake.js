import { useEffect, useState } from 'react';
import { API_URL } from '../services/api';

// Free-tier hosting sleeps when idle. Ping a public endpoint on page load so the server is awake by the time someone signs in.
export default function useServerWake() {
  const [state, setState] = useState('waking');

  useEffect(() => {
    let cancelled = false;
    const started = Date.now();
    fetch(`${API_URL}/ws/info`, { cache: 'no-store' })
      .then(r => { if (!cancelled) setState(r.ok ? (Date.now() - started > 3000 ? 'woke' : 'ready') : 'down'); })
      .catch(() => { if (!cancelled) setState('down'); });
    return () => { cancelled = true; };
  }, []);

  return state;
}
