import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { SearchIcon, XCircleIcon, SpinnerIcon } from './icons';

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  allUsers: User[];
  onCreateConversation: (participants: User[]) => Promise<void>;
}

const NewMessageModal: React.FC<NewMessageModalProps> = ({ isOpen, onClose, currentUser, allUsers, onCreateConversation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const availableUsers = useMemo(() => 
    allUsers.filter(u => u.id !== currentUser.id),
    [allUsers, currentUser.id]
  );

  const filteredUsers = useMemo(() =>
    availableUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [availableUsers, searchTerm]
  );

  const handleToggleUser = (user: User) => {
    setSelectedUsers(prev =>
      prev.some(su => su.id === user.id)
        ? prev.filter(su => su.id !== user.id)
        : [...prev, user]
    );
  };

  const handleCreate = async () => {
    if (isCreating) return;
    setIsCreating(true);
    await onCreateConversation(selectedUsers);
    // The parent component is responsible for closing the modal and resetting state.
    // However, we should reset our internal state here too in case parent logic changes.
    setIsCreating(false);
    resetState();
  };

  const resetState = () => {
    setSearchTerm('');
    setSelectedUsers([]);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-[70vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">New Message</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        
        <div className="p-4 border-b">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search for people..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {selectedUsers.map(user => (
                        <div key={user.id} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-1 rounded-full flex items-center">
                            {user.name}
                            <button onClick={() => handleToggleUser(user)} className="ml-1.5">
                                <XCircleIcon className="w-4 h-4 text-indigo-500 hover:text-indigo-700" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
        
        <div className="flex-grow overflow-y-auto">
          {filteredUsers.map(user => (
            <div 
              key={user.id}
              onClick={() => handleToggleUser(user)}
              className="flex items-center p-3 cursor-pointer hover:bg-gray-50"
            >
                <input
                    type="checkbox"
                    checked={selectedUsers.some(su => su.id === user.id)}
                    readOnly
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                {/* Campus Buzz: User avatar in the new message user selection list */}
                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full mx-3" />
                <span className="font-semibold">{user.name}</span>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <button
            onClick={handleCreate}
            disabled={selectedUsers.length === 0 || isCreating}
            className="w-full bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors flex justify-center items-center"
          >
            {isCreating ? <SpinnerIcon /> : (selectedUsers.length > 1 ? 'Start Group Chat' : 'Start Chat')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;