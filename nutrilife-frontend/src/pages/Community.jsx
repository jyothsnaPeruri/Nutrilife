import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/appStore';
import useChat from '../hooks/useChat';

export default function Community() {
  const { user } = useAppStore();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [room, setRoom] = useState('general');
  const { messages, connected, sendMessage } = useChat(room, user);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  const formatTime = (dt) => {
    if (!dt) return '';
    return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const rooms = ['general', 'nutrition', 'fitness', 'recipes'];

  return (
    <div style={{ maxWidth: 800, margin: '30px auto', padding: '0 16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0 }}>💬 Community</h2>
          <span style={{
            fontSize: 12, padding: '3px 8px', borderRadius: 10,
            background: connected ? '#f0fff0' : '#fff5f5',
            color: connected ? '#4CAF50' : '#e53935'
          }}>
            {connected ? '🟢 Connected' : '🔴 Connecting...'}
          </span>
        </div>
        <button onClick={() => navigate('/dashboard')}
          style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}>
          ← Dashboard
        </button>
      </div>

      {/* Room selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {rooms.map(r => (
          <button key={r} onClick={() => setRoom(r)}
            style={{
              padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
              border: room === r ? '1.5px solid #4CAF50' : '1px solid #ddd',
              background: room === r ? '#f0fff0' : '#fff',
              color: room === r ? '#4CAF50' : '#666',
              fontWeight: room === r ? 600 : 400,
              textTransform: 'capitalize', fontSize: 13
            }}>
            #{r}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{
        background: '#fff', border: '1px solid #eee',
        borderRadius: 12, padding: 16,
        height: 420, overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 10
      }}>
        {messages.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', marginTop: 80 }}>
            No messages yet. Say hello! 👋
          </p>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderEmail === user?.email;
            const isSystem = msg.type === 'JOIN' || msg.type === 'LEAVE';

            if (isSystem) return (
              <div key={idx} style={{ textAlign: 'center', fontSize: 12, color: '#aaa', padding: '4px 0' }}>
                {msg.content}
              </div>
            );

            return (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: isMe ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '70%',
                  background: isMe ? '#4CAF50' : '#f5f5f5',
                  color: isMe ? '#fff' : '#333',
                  borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: '10px 14px'
                }}>
                  {!isMe && (
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, opacity: 0.7 }}>
                      {msg.senderName}
                    </div>
                  )}
                  <div style={{ fontSize: 14 }}>{msg.content}</div>
                  <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: 'right' }}>
                    {formatTime(msg.sentAt)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={connected ? `Message #${room}...` : 'Connecting...'}
          disabled={!connected}
          style={{
            flex: 1, padding: '12px 16px', borderRadius: 24,
            border: '1px solid #ddd', fontSize: 14,
            outline: 'none'
          }}
        />
        <button type="submit" disabled={!connected || !input.trim()}
          style={{
            padding: '12px 24px', borderRadius: 24,
            background: '#4CAF50', color: '#fff',
            border: 'none', cursor: 'pointer', fontWeight: 600
          }}>
          Send
        </button>
      </form>
    </div>
  );
}