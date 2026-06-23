import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs.min.js';
export default function useChat(room, user) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!room || !user) return;

    // Load recent messages
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/api/chat/${room}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setMessages(Array.isArray(data) ? data : []));

    // Connect WebSocket
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);

        // Subscribe to room
        client.subscribe(`/topic/chat/${room}`, (message) => {
          const msg = JSON.parse(message.body);
          setMessages(prev => [...prev, msg]);
        });

        // Send join notification
        client.publish({
          destination: `/app/chat.join/${room}`,
          body: JSON.stringify({
            senderName: user.name,
            senderEmail: user.email,
            type: 'JOIN'
          })
        });
      },
      onDisconnect: () => setConnected(false)
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [room, user]);

  const sendMessage = (content) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: `/app/chat.send/${room}`,
        body: JSON.stringify({
          senderName: user.name,
          senderEmail: user.email,
          content,
          type: 'CHAT'
        })
      });
    }
  };

  return { messages, connected, sendMessage };
}