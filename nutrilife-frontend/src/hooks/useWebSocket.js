import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs.min.js';
import { WS_URL } from '../services/api';

export default function useWebSocket(userEmail) {
  const [connected, setConnected] = useState(false);
  const [nutritionUpdate, setNutritionUpdate] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!userEmail) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        // Subscribe to live nutrition updates
        client.subscribe(`/topic/nutrition/${userEmail}`, (message) => {
          setNutritionUpdate(JSON.parse(message.body));
        });
      },
      onDisconnect: () => setConnected(false),
      onWebSocketClose: () => setConnected(false),
      onStompError: (error) => console.error('STOMP error:', error)
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [userEmail]);

  const sendMessage = (destination, body) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({ destination, body: JSON.stringify(body) });
    }
  };

  return { connected, nutritionUpdate, sendMessage, client: clientRef.current };
}
