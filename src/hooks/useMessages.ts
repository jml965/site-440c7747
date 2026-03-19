import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { messageService } from '../services/messageService';
import type { Conversation, Message } from '../types/index';

export function useMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket, isConnected } = useSocket();

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (err) {
      setError('فشل في تحميل المحادثات');
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const data = await messageService.getMessages(conversationId);
      setMessages(prev => {
        const filtered = prev.filter(m => m.conversationId !== conversationId);
        return [...filtered, ...data];
      });
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    try {
      const message = await messageService.sendMessage(conversationId, content);
      
      // Add message to local state immediately for optimistic UI
      setMessages(prev => [...prev, message]);
      
      // Update conversation's last message
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { 
                ...conv, 
                lastMessage: {
                  id: message.id,
                  content: message.content,
                  createdAt: message.createdAt,
                  isFromCurrentUser: true
                },
                updatedAt: new Date()
              }
            : conv
        )
      );

      // Emit via socket if connected
      if (socket && isConnected) {
        socket.emit('sendMessage', {
          conversationId,
          content,
          messageId: message.id
        });
      }

      return message;
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  }, [socket, isConnected]);

  // Start a new conversation
  const startConversation = useCallback(async (listingId: string, initialMessage: string) => {
    try {
      const conversation = await messageService.startConversation(listingId, initialMessage);
      
      // Add to conversations list
      setConversations(prev => [conversation, ...prev]);
      
      // Load messages for this conversation
      await loadMessages(conversation.id);
      
      return conversation;
    } catch (err) {
      console.error('Error starting conversation:', err);
      throw err;
    }
  }, [loadMessages]);

  // Get a specific conversation
  const getConversation = useCallback(async (conversationId: string) => {
    try {
      const conversation = await messageService.getConversation(conversationId);
      
      // Add to conversations if not already there
      setConversations(prev => {
        const exists = prev.find(c => c.id === conversationId);
        if (!exists) {
          return [conversation, ...prev];
        }
        return prev.map(c => c.id === conversationId ? conversation : c);
      });
      
      // Load messages
      await loadMessages(conversationId);
      
      return conversation;
    } catch (err) {
      console.error('Error getting conversation:', err);
      throw err;
    }
  }, [loadMessages]);

  // Mark conversation as read
  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      await messageService.markAsRead(conversationId);
      
      // Update local state
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
      
      setMessages(prev => 
        prev.map(msg => 
          msg.conversationId === conversationId && !msg.isFromCurrentUser && !msg.readAt
            ? { ...msg, readAt: new Date() }
            : msg
        )
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    // New message received
    const handleNewMessage = (data: { message: Message; conversationId: string }) => {
      const { message, conversationId } = data;
      
      // Add message to state
      setMessages(prev => {
        const exists = prev.find(m => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
      
      // Update conversation
      setConversations(prev => 
        prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: {
                id: message.id,
                content: message.content,
                createdAt: message.createdAt,
                isFromCurrentUser: message.isFromCurrentUser
              },
              unreadCount: message.isFromCurrentUser ? conv.unreadCount : (conv.unreadCount || 0) + 1,
              updatedAt: new Date()
            };
          }
          return conv;
        })
      );
    };

    // Message status update
    const handleMessageUpdate = (data: { messageId: string; status: 'delivered' | 'read'; timestamp: Date }) => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === data.messageId
            ? {
                ...msg,
                [data.status === 'delivered' ? 'deliveredAt' : 'readAt']: new Date(data.timestamp)
              }
            : msg
        )
      );
    };

    // User typing
    const handleTyping = (data: { conversationId: string; userId: string; isTyping: boolean }) => {
      // You can implement typing indicators here if needed
      console.log('User typing:', data);
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messageUpdate', handleMessageUpdate);
    socket.on('userTyping', handleTyping);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messageUpdate', handleMessageUpdate);
      socket.off('userTyping', handleTyping);
    };
  }, [socket, isConnected]);

  // Initial load
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Get unread count
  const totalUnreadCount = conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);

  return {
    conversations,
    messages,
    loading,
    error,
    totalUnreadCount,
    sendMessage,
    startConversation,
    getConversation,
    markAsRead,
    loadMessages,
    loadConversations
  };
}