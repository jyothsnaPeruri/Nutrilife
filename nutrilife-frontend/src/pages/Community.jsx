import { useState, useEffect, useRef } from 'react';
import useAppStore from '../store/appStore';
import useChat from '../hooks/useChat';
import { Button, Card, Chip, EmptyState, PageHeader, fmtTime } from '../components/ui';

const ROOMS = [
  { id: 'general', label: 'General', icon: '💬' },
  { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
  { id: 'fitness', label: 'Fitness', icon: '🏃' },
  { id: 'recipes', label: 'Recipes', icon: '🍳' },
];

export default function Community() {
  const { user } = useAppStore();
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

  return (
    <>
      <PageHeader
        title="Community"
        subtitle={connected ? `You're in #${room}` : 'Connecting…'}
        actions={
          <div className="form-row">
            {ROOMS.map(r => <Chip key={r.id} active={room === r.id} onClick={() => setRoom(r.id)}>{r.icon} {r.label}</Chip>)}
          </div>
        }
      />

      <Card style={{ padding: 16 }}>
        <div className="chat">
          <div className="chat-log">
            {messages.length === 0 ? (
              <EmptyState icon="👋" title="Quiet in here" text={`Be the first to say hello in #${room}.`} />
            ) : (
              messages.map((msg, idx) => {
                const isMe = msg.senderEmail === user?.email;
                const isSystem = msg.type === 'JOIN' || msg.type === 'LEAVE';
                if (isSystem) return <div key={idx} className="msg system">{msg.content}</div>;
                return (
                  <div key={idx} className={`msg ${isMe ? 'me' : ''}`}>
                    <div className="bubble">
                      {!isMe && <div className="who">{msg.senderName}</div>}
                      <div>{msg.content}</div>
                      <div className="when">{fmtTime(msg.sentAt)}</div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={handleSend} className="chat-input">
            <input
              className="input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={connected ? `Message #${room}` : 'Connecting…'}
              disabled={!connected}
              maxLength={500}
            />
            <Button type="submit" disabled={!connected || !input.trim()}>Send</Button>
          </form>
        </div>
      </Card>
    </>
  );
}
