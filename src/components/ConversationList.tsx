import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Package, User } from 'lucide-react';
import type { Conversation } from '../types/index';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const formatMessageTime = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: ar
      });
    } catch {
      return 'منذ قليل';
    }
  };

  const truncateMessage = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conversation) => {
        const isSelected = selectedId === conversation.id;
        const hasUnread = conversation.unreadCount > 0;
        const otherUser = conversation.otherUser || conversation.listing?.user;
        const lastMessage = conversation.lastMessage;
        
        return (
          <div
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
              isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            } ${hasUnread ? 'bg-blue-50/30' : ''}`}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                hasUnread ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-400'
              }`}>
                {otherUser?.name?.charAt(0) || <User className="h-6 w-6" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-semibold truncate ${
                    hasUnread ? 'text-blue-800' : 'text-gray-800'
                  }`}>
                    {otherUser?.name || 'مستخدم'}
                  </h4>
                  {lastMessage && (
                    <span className="text-xs text-gray-500 flex-shrink-0 mr-2">
                      {formatMessageTime(lastMessage.createdAt)}
                    </span>
                  )}
                </div>

                {/* Listing info */}
                {conversation.listing && (
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500 truncate">
                      {conversation.listing.title}
                    </span>
                  </div>
                )}

                {/* Last message */}
                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate ${
                    hasUnread ? 'text-gray-800 font-medium' : 'text-gray-600'
                  }`}>
                    {lastMessage ? (
                      <>
                        {lastMessage.isFromCurrentUser ? 'أنت: ' : ''}
                        {truncateMessage(lastMessage.content)}
                      </>
                    ) : (
                      'لا توجد رسائل بعد'
                    )}
                  </p>
                  
                  {/* Unread badge */}
                  {hasUnread && (
                    <div className="bg-blue-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 flex-shrink-0 mr-2">
                      {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Listing thumbnail */}
            {conversation.listing?.images?.[0] && (
              <div className="mt-3 mr-15">
                <img
                  src={conversation.listing.images[0]}
                  alt={conversation.listing.title}
                  className="w-16 h-12 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}