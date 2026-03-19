import React, { useState, useEffect } from 'react';
import { MessageCircle, Search, User } from 'lucide-react';
import ConversationList from '../components/ConversationList';
import MessageThread from '../components/MessageThread';
import { useMessages } from '../hooks/useMessages';
import type { Conversation, Message } from '../types/index';

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { conversations, messages, loading, sendMessage, markAsRead } = useMessages();

  const filteredConversations = conversations.filter(conversation => {
    const otherUser = conversation.listing?.user?.name || conversation.otherUser?.name || '';
    const listingTitle = conversation.listing?.title || '';
    return otherUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
           listingTitle.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);
  const conversationMessages = messages.filter(m => m.conversationId === selectedConversation);

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
    markAsRead(conversationId);
  };

  const handleSendMessage = (content: string) => {
    if (selectedConversation) {
      sendMessage(selectedConversation, content);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل المحادثات...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-8 w-8" />
              <h1 className="text-2xl font-bold">الرسائل</h1>
            </div>
          </div>

          <div className="flex h-[70vh]">
            {/* Conversations Sidebar */}
            <div className="w-1/3 border-l border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="بحث في المحادثات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length > 0 ? (
                  <ConversationList
                    conversations={filteredConversations}
                    selectedId={selectedConversation}
                    onSelect={handleConversationSelect}
                  />
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">لا توجد محادثات</p>
                    <p className="text-sm">ابدأ محادثة جديدة من خلال التواصل مع أحد البائعين</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation && selectedConversationData ? (
                <MessageThread
                  conversation={selectedConversationData}
                  messages={conversationMessages}
                  onSendMessage={handleSendMessage}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <User className="h-20 w-20 mx-auto mb-4 text-gray-300" />
                    <p className="text-xl font-medium mb-2">اختر محادثة لبدء المراسلة</p>
                    <p className="text-sm">اختر محادثة من القائمة الجانبية لعرض الرسائل</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}