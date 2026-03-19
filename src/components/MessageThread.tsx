import React, { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Check, CheckCheck, Clock, User } from 'lucide-react';
import MessageInput from './MessageInput';
import type { Conversation, Message } from '../types/index';

interface MessageThreadProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export default function MessageThread({ conversation, messages, onSendMessage }: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageTime = (date: Date) => {
    const messageDate = new Date(date);
    
    if (isToday(messageDate)) {
      return format(messageDate, 'HH:mm');
    } else if (isYesterday(messageDate)) {
      return 'أمس ' + format(messageDate, 'HH:mm');
    } else {
      return format(messageDate, 'dd/MM HH:mm');
    }
  };

  const formatDateSeparator = (date: Date) => {
    const messageDate = new Date(date);
    
    if (isToday(messageDate)) {
      return 'اليوم';
    } else if (isYesterday(messageDate)) {
      return 'أمس';
    } else {
      return format(messageDate, 'dd MMMM yyyy', { locale: ar });
    }
  };

  const getMessageStatus = (message: Message) => {
    if (!message.isFromCurrentUser) return null;
    
    if (message.readAt) {
      return <CheckCheck className="h-4 w-4 text-blue-500" />;
    } else if (message.deliveredAt) {
      return <CheckCheck className="h-4 w-4 text-gray-400" />;
    } else {
      return <Check className="h-4 w-4 text-gray-400" />;
    }
  };

  const shouldShowDateSeparator = (currentMessage: Message, previousMessage?: Message) => {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.createdAt);
    const previousDate = new Date(previousMessage.createdAt);
    
    return currentDate.toDateString() !== previousDate.toDateString();
  };

  const groupedMessages = messages.reduce((groups: { date: string; messages: Message[] }[], message, index) => {
    if (shouldShowDateSeparator(message, messages[index - 1])) {
      groups.push({
        date: formatDateSeparator(message.createdAt),
        messages: [message]
      });
    } else {
      groups[groups.length - 1].messages.push(message);
    }
    return groups;
  }, []);

  const handleSendMessage = (content: string) => {
    onSendMessage(content);
    setIsTyping(false);
  };

  const otherUser = conversation.otherUser || conversation.listing?.user;

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {groupedMessages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center py-12">
            <div>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                ابدأ المحادثة مع {otherUser?.name || 'المستخدم'}
              </h3>
              <p className="text-gray-600 text-sm">
                اكتب رسالتك الأولى للبدء في المحادثة
              </p>
            </div>
          </div>
        ) : (
          groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Date separator */}
              <div className="flex justify-center mb-4">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  {group.date}
                </span>
              </div>

              {/* Messages in this date group */}
              <div className="space-y-2">
                {group.messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isFromCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${message.isFromCurrentUser ? 'order-2' : 'order-1'}`}>
                      <div className={`rounded-2xl px-4 py-2 ${
                        message.isFromCurrentUser
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-800 rounded-bl-md'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                      
                      {/* Message info */}
                      <div className={`flex items-center gap-2 mt-1 px-2 ${
                        message.isFromCurrentUser ? 'justify-end' : 'justify-start'
                      }`}>
                        <span className="text-xs text-gray-500">
                          {formatMessageTime(message.createdAt)}
                        </span>
                        {getMessageStatus(message)}
                      </div>
                    </div>

                    {/* Avatar for other user */}
                    {!message.isFromCurrentUser && (
                      <div className="order-1 w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold ml-2 flex-shrink-0">
                        {otherUser?.name?.charAt(0) || 'م'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={(typing) => setIsTyping(typing)}
          disabled={false}
        />
      </div>
    </div>
  );
}