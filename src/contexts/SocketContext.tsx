import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AppContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  reconnect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

interface ServerToClientEvents {
  newMessage: (data: { message: any; conversationId: string }) => void;
  messageUpdate: (data: { messageId: string; status: 'delivered' | 'read'; timestamp: Date }) => void;
  userTyping: (data: { conversationId: string; userId: string; isTyping: boolean }) => void;
  userOnline: (data: { userId: string }) => void;
  userOffline: (data: { userId: string }) => void;
  conversationUpdate: (data: { conversationId: string; type: string; data: any }) => void;
  notification: (data: { type: string; title: string; message: string; data?: any }) => void;
}

interface ClientToServerEvents {
  authenticate: (token: string) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (data: { conversationId: string; content: string; messageId: string }) => void;
  typing: (data: { conversationId: string; isTyping: boolean }) => void;
  markAsRead: (data: { conversationId: string; messageId: string }) => void;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const { user, token } = useAuth();

  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  const createConnection = () => {
    if (!user || socket?.connected) return;

    // For development, use mock socket or disable real connection
    const isDevelopment = import.meta.env.DEV;
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

    if (isDevelopment) {
      // Create a mock socket for development
      const mockSocket = {
        connected: true,
        emit: (event: string, data?: any) => {
          console.log('Mock socket emit:', event, data);
        },
        on: (event: string, callback: Function) => {
          console.log('Mock socket on:', event);
          // Store callback for potential mock events
        },
        off: (event: string, callback?: Function) => {
          console.log('Mock socket off:', event);
        },
        disconnect: () => {
          console.log('Mock socket disconnect');
          setIsConnected(false);
        },
        connect: () => {
          console.log('Mock socket connect');
          setIsConnected(true);
        }
      } as any;

      setSocket(mockSocket);
      setIsConnected(true);
      setReconnectAttempts(0);
      return;
    }

    try {
      const newSocket = io(socketUrl, {
        auth: {
          token: token || ''
        },
        autoConnect: false,
        reconnection: true,
        reconnectionDelay: reconnectDelay,
        reconnectionAttempts: maxReconnectAttempts,
        timeout: 10000
      });

      // Connection events
      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        setReconnectAttempts(0);
        
        // Authenticate
        if (token) {
          newSocket.emit('authenticate', token);
        }
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
        setReconnectAttempts(prev => prev + 1);
      });

      newSocket.on('reconnect', (attemptNumber) => {
        console.log('Socket reconnected after', attemptNumber, 'attempts');
        setReconnectAttempts(0);
      });

      newSocket.on('reconnect_failed', () => {
        console.error('Socket reconnection failed after', maxReconnectAttempts, 'attempts');
      });

      // Message events - these will be handled by useMessages hook
      newSocket.on('newMessage', (data) => {
        console.log('New message received:', data);
      });

      newSocket.on('messageUpdate', (data) => {
        console.log('Message update:', data);
      });

      newSocket.on('userTyping', (data) => {
        console.log('User typing:', data);
      });

      newSocket.on('notification', (data) => {
        console.log('Notification received:', data);
        // You can dispatch notifications to a notification system here
      });

      setSocket(newSocket);
      newSocket.connect();

    } catch (error) {
      console.error('Error creating socket connection:', error);
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  };

  const reconnect = () => {
    disconnect();
    setReconnectAttempts(0);
    setTimeout(() => {
      createConnection();
    }, 1000);
  };

  // Initialize connection when user is authenticated
  useEffect(() => {
    if (user && token) {
      createConnection();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [user, token]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const value: SocketContextType = {
    socket,
    isConnected,
    reconnect,
    disconnect
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket(): SocketContextType {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

export default SocketContext;