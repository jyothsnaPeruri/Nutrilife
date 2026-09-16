export default function AuthSide() {
  return (
    <aside className="auth-side">
      <div>
        <h2>Everything about your day, in one calm place.</h2>
        <p>Log meals, water and workouts in seconds. Watch your goals update live, and get an AI coach's take on your week.</p>
        <ul>
          <li>⚡ Live dashboard over WebSockets</li>
          <li>🎯 Daily targets with progress rings</li>
          <li>💬 Community rooms for nutrition, fitness and recipes</li>
          <li>🤖 AI-written weekly wellness report</li>
        </ul>
      </div>
      <p style={{ fontSize: 12, opacity: 0.7 }}>Spring Boot · React · WebSockets · LLM API</p>
    </aside>
  );
}
