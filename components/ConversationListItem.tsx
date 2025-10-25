import React from 'react';
import { Conversation, User } from '../types';
import AvatarWithStatus from './AvatarWithStatus';

interface ConversationListItemProps {
  conversation: Conversation;
  currentUser: User;
  isActive: boolean;
  onSelect: () => void;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({ conversation, currentUser, isActive, onSelect }) => {
  const otherParticipants = conversation.participants.filter(p => p.id !== currentUser.id);
  const lastMessage = conversation.messages[conversation.messages.length - 1];

  let title = '';
  // Campus Buzz: Default avatar for a group chat
  let avatarUrl = 'https://picsum.photos/seed/group/200';
  let status: 'online' | 'offline' | undefined = undefined;

  if (conversation.isGroup) {
    title = conversation.groupName || 'Group Chat';
  } else if (otherParticipants.length > 0) {
    title = otherParticipants.map(p => p.name).join(', ');
    avatarUrl = otherParticipants[0].avatarUrl;
    status = otherParticipants[0].onlineStatus;
  } else {
    title = 'Self Chat'; // Edge case
    avatarUrl = currentUser.avatarUrl;
  }
  
  const truncateText = (text: string, length: number) => {
      return text.length > length ? text.substring(0, length) + '...' : text;
  }

  return (
    <div
      onClick={onSelect}
      className={`flex items-center p-3 cursor-pointer border-l-4 ${isActive ? 'bg-indigo-50 border-indigo-500' : 'border-transparent hover:bg-gray-50'}`}
    >
      <div className="mr-4">
        {/* Campus Buzz: Avatar for a conversation (user or group) in the list */}
        <AvatarWithStatus avatarUrl={avatarUrl} alt={title} status={status} size="lg" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className={`font-semibold text-gray-800 truncate ${conversation.unreadCount > 0 ? 'font-bold' : ''}`}>
            {title}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {conversation.unreadCount}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">
          {lastMessage ? truncateText(lastMessage.text, 25) : 'No messages yet'}
        </p>
      </div>
    </div>
  );
};

export default ConversationListItem;