import { useState, useEffect, useRef, useCallback } from 'react';

export interface WebSocketMessage {
  type: string;
  message?: string;
  sentence?: string;
  is_complete?: boolean;
  issues?: any[];
  suggestions?: any[];
  score?: number;
  explanation?: string;
  polished_sentence?: string;
  polished_explanation?: string;
  data?: any;
}

export interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: any) => void;
  startSession: () => void;
  sendTextUpdate: (text: string) => void;
  requestImprovement: (text: string) => void;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000';

export function useWebSocket(clientId: string): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');
    
    try {
      const ws = new WebSocket(`${WS_BASE_URL}/ws/writing-assistant/${clientId}`);
      
      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          setLastMessage(message);
          
          if (message.type === 'connected') {
            console.log('📝', message.message);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setConnectionStatus('disconnected');
        wsRef.current = null;

        // 尝试重新连接
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current += 1;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
          
          console.log(`Attempting to reconnect in ${delay}ms... (attempt ${reconnectAttemptsRef.current})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          console.error('Max reconnection attempts reached');
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setConnectionStatus('error');
    }
  }, [clientId]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }, []);

  const startSession = useCallback(() => {
    sendMessage({ type: 'start_session' });
  }, [sendMessage]);

  const sendTextUpdate = useCallback((text: string) => {
    sendMessage({ type: 'text_update', text });
  }, [sendMessage]);

  const requestImprovement = useCallback((text: string) => {
    sendMessage({ type: 'request_improvement', text });
  }, [sendMessage]);

  // 自动连接
  useEffect(() => {
    connect();

    // 心跳检测
    const heartbeatInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        sendMessage({ type: 'ping' });
      }
    }, 30000); // 每30秒发送一次心跳

    return () => {
      clearInterval(heartbeatInterval);
      disconnect();
    };
  }, [connect, disconnect, sendMessage]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    startSession,
    sendTextUpdate,
    requestImprovement,
    connectionStatus,
  };
}



