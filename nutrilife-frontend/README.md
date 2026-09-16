# NutriLife — frontend

React 18 + Vite. Talks to the Spring Boot backend over REST (`/api/*`) and STOMP over SockJS (`/ws`) for live updates and chat.

## Run locally

```bash
npm install
cp .env.example .env      # set VITE_API_URL if the backend is not on http://localhost:8080
npm run dev
```

## Build

```bash
npm run build             # output in dist/
```

## Structure

- `src/components/Layout.jsx` — app shell (sidebar, top bar with live indicator, mobile bottom nav). Opens the WebSocket once and shares it via `useLive()`.
- `src/components/ui.jsx` — shared building blocks: `Card`, `Button`, `Stat`, `Ring`, `ProgressBar`, `Tabs`, `Alert`, `EmptyState`…
- `src/services/api.js` — `apiFetch()` adds the JWT and the API base URL; redirects to login on 401.
- `src/hooks/` — `useWebSocket` (nutrition updates) and `useChat` (community rooms).
- `src/pages/` — one file per screen.
- `src/index.css` — design tokens (light/dark via `prefers-color-scheme`) and component styles.
