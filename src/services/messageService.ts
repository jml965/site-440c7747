import { api } from './api';
import type { Conversation, Message, CreateMessageRequest, StartConversationRequest } from '../types/index';

// Mock data for development
const mockConversations: Conversation[] = [
  {
    id: '1',
    listingId: '1',
    buyerId: 'user1',
    sellerId: 'user2',
    listing: {
      id: '1',
      title: 'ايفون 14 برو ماكس 256 جيجا',
      price: 4200,
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop'],
      user: {
        id: 'user2',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '+966501234567',
        createdAt: new Date('2023-01-01'),
        rating: 4.5,
        reviewsCount: 12
      }
    },
    otherUser: {
      id: 'user2',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '+966501234567',
      createdAt: new Date('2023-01-01'),
      rating: 4.5,
      reviewsCount: 12
    },
    lastMessage: {
      id: 'msg1',
      content: 'هل لا يزال الجهاز متوفراً؟',
      createdAt: new Date('2024-12-28T10:30:00'),
      isFromCurrentUser: true
    },
    unreadCount: 0,
    createdAt: new Date('2024-12-28T10:00:00'),
    updatedAt: new Date('2024-12-28T10:30:00')
  },
  {
    id: '2',
    listingId: '2',
    buyerId: 'user1',
    sellerId: 'user3',
    listing: {
      id: '2',
      title: 'طاولة طعام خشب زان 6 كراسي',
      price: 1800,
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'],
      user: {
        id: 'user3',
        name: 'فاطمة العلي',
        email: 'fatima@example.com',
        phone: '+966509876543',
        createdAt: new Date('2023-03-01'),
        rating: 4.8,
        reviewsCount: 8
      }
    },
    otherUser: {
      id: 'user3',
      name: 'فاطمة العلي',
      email: 'fatima@example.com',
      phone: '+966509876543',
      createdAt: new Date('2023-03-01'),
      rating: 4.8,
      reviewsCount: 8
    },
    lastMessage: {
      id: 'msg4',
      content: 'يمكنني الحضور غداً لمعاينة الطاولة',
      createdAt: new Date('2024-12-27T15:45:00'),
      isFromCurrentUser: false
    },
    unreadCount: 2,
    createdAt: new Date('2024-12-27T14:00:00'),
    updatedAt: new Date('2024-12-27T15:45:00')
  },
  {
    id: '3',
    listingId: '3',
    buyerId: 'user1',
    sellerId: 'user4',
    listing: {
      id: '3',
      title: 'لاب توب لينوفو ثينك باد X1',
      price: 3500,
      images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'],
      user: {
        id: 'user4',
        name: 'محمد السعيد',
        email: 'mohammed@example.com',
        phone: '+966551234567',
        createdAt: new Date('2023-05-01'),
        rating: 4.2,
        reviewsCount: 5
      }
    },
    otherUser: {
      id: 'user4',
      name: 'محمد السعيد',
      email: 'mohammed@example.com',
      phone: '+966551234567',
      createdAt: new Date('2023-05-01'),
      rating: 4.2,
      reviewsCount: 5
    },
    lastMessage: {
      id: 'msg6',
      content: 'شكراً لك، سأفكر في الأمر',
      createdAt: new Date('2024-12-26T20:15:00'),
      isFromCurrentUser: true
    },
    unreadCount: 0,
    createdAt: new Date('2024-12-26T18:00:00'),
    updatedAt: new Date('2024-12-26T20:15:00')
  }
];

const mockMessages: Message[] = [
  {
    id: 'msg1',
    conversationId: '1',
    senderId: 'user1',
    content: 'مرحبا، أنا مهتم بالايفون. هل لا يزال متوفراً؟',
    isFromCurrentUser: true,
    createdAt: new Date('2024-12-28T10:30:00'),
    deliveredAt: new Date('2024-12-28T10:30:30'),
    readAt: new Date('2024-12-28T10:35:00')
  },
  {
    id: 'msg2',
    conversationId: '1',
    senderId: 'user2',
    content: 'نعم الجهاز متوفر. هل تريد معاينته؟',
    isFromCurrentUser: false,
    createdAt: new Date('2024-12-28T10:35:00'),
    deliveredAt: new Date('2024-12-28T10:35:30'),
    readAt: new Date('2024-12-28T10:40:00')
  },
  {
    id: 'msg3',
    conversationId: '1',
    senderId: 'user1',
    content: 'نعم، أين يمكنني معاينته؟',
    isFromCurrentUser: true,
    createdAt: new Date('2024-12-28T10:40:00'),
    deliveredAt: new Date('2024-12-28T10:40:30')
  },
  {
    id: 'msg4',
    conversationId: '2',
    senderId: 'user1',
    content: 'مرحبا، هل يمكنني معاينة الطاولة؟',
    isFromCurrentUser: true,
    createdAt: new Date('2024-12-27T14:30:00'),
    deliveredAt: new Date('2024-12-27T14:30:30'),
    readAt: new Date('2024-12-27T15:00:00')
  },
  {
    id: 'msg5',
    conversationId: '2',
    senderId: 'user3',
    content: 'أهلاً وسهلاً، بالطبع يمكنك المعاينة. متى يناسبك؟',
    isFromCurrentUser: false,
    createdAt: new Date('2024-12-27T15:00:00'),
    deliveredAt: new Date('2024-12-27T15:00:30'),
    readAt: new Date('2024-12-27T15:30:00')
  },
  {
    id: 'msg6',
    conversationId: '2',
    senderId: 'user1',
    content: 'غداً بعد الظهر إذا أمكن',
    isFromCurrentUser: true,
    createdAt: new Date('2024-12-27T15:30:00'),
    deliveredAt: new Date('2024-12-27T15:30:30')
  },
  {
    id: 'msg7',
    conversationId: '2',
    senderId: 'user3',
    content: 'ممتاز، يمكنني الحضور غداً لمعاينة الطاولة',
    isFromCurrentUser: false,
    createdAt: new Date('2024-12-27T15:45:00')
  }
];

export const messageService = {
  // Get all conversations for current user
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await api.get('/conversations');
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      // Sort by last activity
      return [...mockConversations].sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }
  },

  // Get a specific conversation
  async getConversation(id: string): Promise<Conversation> {
    try {
      const response = await api.get(`/conversations/${id}`);
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      const conversation = mockConversations.find(c => c.id === id);
      if (!conversation) {
        throw new Error('المحادثة غير موجودة');
      }
      return conversation;
    }
  },

  // Get messages for a conversation
  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const response = await api.get(`/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      return mockMessages
        .filter(m => m.conversationId === conversationId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
  },

  // Send a message
  async sendMessage(conversationId: string, content: string): Promise<Message> {
    try {
      const response = await api.post(`/conversations/${conversationId}/messages`, {
        content
      });
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      // Create mock message
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        conversationId,
        senderId: 'user1', // Current user
        content,
        isFromCurrentUser: true,
        createdAt: new Date(),
        deliveredAt: new Date(Date.now() + 1000) // Simulate delivery after 1 second
      };
      
      // Add to mock messages
      mockMessages.push(newMessage);
      
      return newMessage;
    }
  },

  // Start a new conversation
  async startConversation(listingId: string, initialMessage: string): Promise<Conversation> {
    try {
      const response = await api.post('/conversations', {
        listingId,
        initialMessage
      });
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      
      // Check if conversation already exists
      const existingConversation = mockConversations.find(c => c.listingId === listingId);
      if (existingConversation) {
        // Send the initial message
        await this.sendMessage(existingConversation.id, initialMessage);
        return existingConversation;
      }

      // Create new conversation
      const newConversation: Conversation = {
        id: `conv_${Date.now()}`,
        listingId,
        buyerId: 'user1',
        sellerId: 'user_seller',
        listing: {
          id: listingId,
          title: 'منتج جديد',
          price: 1000,
          images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'],
          user: {
            id: 'user_seller',
            name: 'البائع',
            email: 'seller@example.com',
            phone: '+966501234567',
            createdAt: new Date('2023-01-01'),
            rating: 4.5,
            reviewsCount: 10
          }
        },
        otherUser: {
          id: 'user_seller',
          name: 'البائع',
          email: 'seller@example.com',
          phone: '+966501234567',
          createdAt: new Date('2023-01-01'),
          rating: 4.5,
          reviewsCount: 10
        },
        lastMessage: {
          id: `msg_${Date.now()}`,
          content: initialMessage,
          createdAt: new Date(),
          isFromCurrentUser: true
        },
        unreadCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add to mock data
      mockConversations.unshift(newConversation);
      
      // Send the initial message
      await this.sendMessage(newConversation.id, initialMessage);
      
      return newConversation;
    }
  },

  // Mark conversation as read
  async markAsRead(conversationId: string): Promise<void> {
    try {
      await api.put(`/conversations/${conversationId}/read`);
    } catch (error) {
      console.warn('API not available, using mock data');
      // Update mock data
      const conversation = mockConversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.unreadCount = 0;
      }
      
      // Mark messages as read
      mockMessages.forEach(msg => {
        if (msg.conversationId === conversationId && !msg.isFromCurrentUser && !msg.readAt) {
          msg.readAt = new Date();
        }
      });
    }
  },

  // Delete a conversation
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await api.delete(`/conversations/${conversationId}`);
    } catch (error) {
      console.warn('API not available, using mock data');
      // Remove from mock data
      const index = mockConversations.findIndex(c => c.id === conversationId);
      if (index !== -1) {
        mockConversations.splice(index, 1);
      }
      
      // Remove messages
      for (let i = mockMessages.length - 1; i >= 0; i--) {
        if (mockMessages[i].conversationId === conversationId) {
          mockMessages.splice(i, 1);
        }
      }
    }
  },

  // Delete a message
  async deleteMessage(messageId: string): Promise<void> {
    try {
      await api.delete(`/messages/${messageId}`);
    } catch (error) {
      console.warn('API not available, using mock data');
      const index = mockMessages.findIndex(m => m.id === messageId);
      if (index !== -1) {
        mockMessages.splice(index, 1);
      }
    }
  },

  // Report a conversation or message
  async reportConversation(conversationId: string, reason: string): Promise<void> {
    try {
      await api.post(`/conversations/${conversationId}/report`, {
        reason
      });
    } catch (error) {
      console.warn('API not available, simulating report');
      console.log('Conversation reported:', { conversationId, reason });
    }
  }
};