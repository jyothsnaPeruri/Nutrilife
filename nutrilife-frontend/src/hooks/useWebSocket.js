import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs.min.js';

export default function useWebSocket(userEmail) {
  const [connected, setConnected] = useState(false);
  const [nutritionUpdate, setNutritionUpdate] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!userEmail) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        console.log('WebSocket connected!');

        // Subscribe to live nutrition updates
        client.subscribe(
          `/topic/nutrition/${userEmail}`,
          (message) => {
            const update = JSON.parse(message.body);
            setNutritionUpdate(update);
          }
        );
      },
      onDisconnect: () => {
        setConnected(false);
        console.log('WebSocket disconnected');
      },
      onStompError: (error) => {
        console.error('STOMP error:', error);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [userEmail]);

  const sendMessage = (destination, body) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body)
      });
    }
  };

  return { connected, nutritionUpdate, sendMessage, client: clientRef.current };
}