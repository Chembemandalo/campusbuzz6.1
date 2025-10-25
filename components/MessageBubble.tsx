import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage }) => {
  const bubbleClasses = isOwnMessage
    ? 'bg-indigo-500 text-white self-end'
    : 'bg-white text-gray-800 self-start';
  
  const containerClasses = isOwnMessage
    ? 'flex items-end justify-end'
    : 'flex items-end';

  return (
    <div className={containerClasses}>
      {!isOwnMessage && (
          // Campus Buzz: Avatar of the message sender in a chat bubble
          <img src={message.sender.avatarUrl} alt={message.sender.name} className="w-8 h-8 rounded-full mr-2" />
      )}
      <div className="flex flex-col" style={{ maxWidth: '75%' }}>
        <div className={`rounded-lg px-4 py-2 shadow-sm ${bubbleClasses}`}>
          {!isOwnMessage && <p className="text-xs font-bold text-purple-600 mb-1">{message.sender.name}</p>}
          <p>{message.text}</p>
        </div>
        <p className={`text-xs text-gray-400 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
            {message.timestamp}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;