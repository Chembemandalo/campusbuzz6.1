import React, { useState } from 'react';
import { Conversation, User } from '../types';
import ConversationListItem from '../components/ConversationListItem';
import ChatWindow from '../components/ChatWindow';
import { SearchIcon, PencilSquareIcon } from '../components/icons';

interface ChatPageProps {
  conversations: Conversation[];
  currentUser: User;
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string | null) => void;
  onSendMessage: (conversationId: string, text: string) => Promise<void>;
  onOpenNewMessageModal: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ conversations, currentUser, activeConversationId, onSelectConversation, onSendMessage, onOpenNewMessageModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const sortedConversations = [...conversations].sort((a, b) => {
    const lastMsgA = a.messages[a.messages.length - 1];
    const lastMsgB = b.messages[b.messages.length - 1];
    // This is a simplified sort, a real app would use Date objects
    // For now, just sorting by unread count as a proxy for recency
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (b.unreadCount > 0 && a.unreadCount === 0) return 1;
    return 0; // Keep original order if both/neither have unread
  });
  
  const filteredConversations = sortedConversations.filter(convo => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();

      // Check group name or participant names
      const title = convo.isGroup
          ? convo.groupName?.toLowerCase()
          : convo.participants.filter(p => p.id !== currentUser.id).map(p => p.name.toLowerCase()).join(' ');
      
      if (title?.includes(query)) return true;

      // Check message content
      return convo.messages.some(msg => msg.text.toLowerCase().includes(query));
  });

  return (
    <div className="container mx-auto mt-0 md:mt-8 h-[calc(100vh-5rem)] md:h-[calc(100vh-10rem)]">
      <div className="flex h-full bg-white rounded-none md:rounded-lg shadow-none md:shadow-xl overflow-hidden">
        {/* Conversation List */}
        <aside className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 flex flex-col ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
           <div className="p-4 border-b">
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                  <button onClick={onOpenNewMessageModal} className="text-indigo-600 hover:text-indigo-800 p-1">
                      <PencilSquareIcon className="w-6 h-6" />
                  </button>
               </div>
               <div className="relative">
                  <input
                      type="text"
                      placeholder="Search messages or people..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               </div>
           </div>
           <div className="flex-grow overflow-y-auto">
               {filteredConversations.map(convo => (
                   <ConversationListItem
                        key={convo.id}
                        conversation={convo}
                        currentUser={currentUser}
                        isActive={convo.id === activeConversationId}
                        onSelect={() => onSelectConversation(convo.id)}
                   />
               ))}
           </div>
        </aside>

        {/* Chat Window */}
        <main className={`flex-1 flex-col ${activeConversationId ? 'flex' : 'hidden md:flex'}`}>
            {activeConversation ? (
                <ChatWindow
                    conversation={activeConversation}
                    currentUser={currentUser}
                    onSendMessage={onSendMessage}
                    onBack={() => onSelectConversation(null)}
                />
            ) : (
                <div className="flex-grow flex items-center justify-center text-gray-500">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold">Welcome to your messages</h3>
                        <p>Select a conversation or start a new one.</p>
                    </div>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
