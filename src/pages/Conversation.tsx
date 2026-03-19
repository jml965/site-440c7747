import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, User, Package } from 'lucide-react';
import MessageThread from '../components/MessageThread';
import { useMessages } from '../hooks/useMessages';
import type { Conversation, Message } from '../types/index';

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { conversations, messages, loading, sendMessage, markAsRead, getConversation } = useMessages();
  const [conversation, setConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    if (id) {
      const conv = conversations.find(c => c.id === id);
      if (conv) {
        setConversation(conv);
        markAsRead(id);
      } else {
        // Try to fetch the conversation if not in the list
        getConversation(id).then(setConversation).catch(() => {
          navigate('/messages');
        });
      }
    }
  }, [id, conversations, markAsRead, getConversation, navigate]);

  const conversationMessages = messages.filter(m => m.conversationId === id);

  const handleSendMessage = (content: string) => {
    if (id) {
      sendMessage(id, content);
    }
  };

  const handleBack = () => {
    navigate('/messages');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل المحادثة...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <User className="h-20 w-20 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">المحادثة غير موجودة</h2>
            <p className="text-gray-600 mb-6">لم يتم العثور على هذه المحادثة أو تم حذفها</p>
            <button
              onClick={handleBack}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              العودة للرسائل
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 p-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {conversation.otherUser?.name?.charAt(0) || 'م'}
            </div>
            <div>
              <h3 className="font-semibold">{conversation.otherUser?.name || 'مستخدم'}</h3>
              {conversation.listing && (
                <p className="text-sm text-gray-500 truncate max-w-40">{conversation.listing.title}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 hidden lg:block">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowRight className="h-6 w-6" />
              </button>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                {conversation.otherUser?.name?.charAt(0) || 'م'}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{conversation.otherUser?.name || 'مستخدم'}</h2>
                {conversation.listing && (
                  <div className="flex items-center gap-2 mt-1">
                    <Package className="h-4 w-4" />
                    <span className="text-white/90">{conversation.listing.title}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Listing Info */}
          {conversation.listing && (
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <img
                  src={conversation.listing.images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop'}
                  alt={conversation.listing.title}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{conversation.listing.title}</h4>
                  <p className="text-lg font-bold text-blue-600">{conversation.listing.price?.toLocaleString()} ر.س</p>
                </div>
                <button
                  onClick={() => navigate(`/listing/${conversation.listing?.id}`)}
                  className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  عرض الإعلان
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="h-[60vh] lg:h-[70vh]">
            <MessageThread
              conversation={conversation}
              messages={conversationMessages}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}