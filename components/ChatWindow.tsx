import React, { useState, useEffect, useRef } from 'react';
import { Conversation, User } from '../types';
import MessageBubble from './MessageBubble';
import { PaperAirplaneIcon, PaperClipIcon, SpinnerIcon } from './icons';
import AvatarWithStatus from './AvatarWithStatus';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: User;
  onSendMessage: (conversationId: string, text: string) => Promise<void>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, currentUser, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherParticipants = conversation.participants.filter(p => p.id !== currentUser.id);
  let title = '';
  // Campus Buzz: Default avatar for a group chat header
  let avatarUrl = 'https://picsum.photos/seed/group/200';
  let status: 'online' | 'offline' | undefined = undefined;
  let statusText = '';

  if (conversation.isGroup) {
    title = conversation.groupName || 'Group Chat';
  } else if (otherParticipants.length > 0) {
    title = otherParticipants[0].name;
    avatarUrl = otherParticipants[0].avatarUrl;
    status = otherParticipants[0].onlineStatus;
    statusText = status === 'online' ? 'Online' : 'Offline';
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    await onSendMessage(conversation.id, newMessage.trim());
    setNewMessage('');
    setIsSending(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center p-3 border-b border-gray-200">
        {/* Campus Buzz: Avatar for the active chat window header */}
        <AvatarWithStatus avatarUrl={avatarUrl} alt={title} status={status} size="md" />
        <div className="ml-3">
          <p className="font-semibold text-gray-800">{title}</p>
          <p className="text-xs text-gray-500">
            {conversation.isGroup ? `${conversation.participants.length} members` : statusText}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {conversation.messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} isOwnMessage={msg.sender.id === currentUser.id} />
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <button type="button" className="text-gray-500 hover:text-indigo-600 p-2 rounded-full">
                <PaperClipIcon className="w-6 h-6" />
            </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center justify-center w-12 h-12"
            disabled={!newMessage.trim() || isSending}
          >
            {isSending ? <SpinnerIcon className="w-5 h-5" /> : <PaperAirplaneIcon className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;