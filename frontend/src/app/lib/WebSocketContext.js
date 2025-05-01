'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const connectWebSocket = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setSocket(ws);
      setRetryCount(0);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setSocket(null);
      // Exponential backoff reconnect
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        if (retryCount < 5) connectWebSocket();
      }, Math.min(1000 * 2 ** retryCount, 30000));
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return ws;
  }, [retryCount]);

  useEffect(() => {
    const ws = connectWebSocket();
    return () => {
      if (ws) ws.close();
    };
  }, [connectWebSocket]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const socket = useContext(WebSocketContext);
  
  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  return { socket, sendMessage };
}