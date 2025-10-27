import React, { useState, useMemo } from 'react';
import { User, Article, Page, MentorshipRequest } from '../types';
import MentorCard from '../components/MentorCard';
import { SearchIcon, UserGroupIcon, AcademicCapIcon, BackButton } from '../components/icons';

interface MentorsPageProps {
  allUsers: User[];
  currentUser: User;
  sentMentorshipRequests: MentorshipRequest[];
  onNavigate: (page: Page, data?: User | Article) => void;
  onSendMentorshipRequest: (mentorId: string) => void;
  onOpenBecomeMentorModal: () => void;
  handleBack: () => void;
}

const MentorsPage: React.FC<MentorsPageProps> = ({ 
    allUsers, 
    currentUser, 
    sentMentorshipRequests,
    onNavigate,
    onSendMentorshipRequest,
    onOpenBecomeMentorModal,
    handleBack
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMentorId, setExpandedMentorId] = useState<string | null>(null);
  
  const mentors = useMemo(() => 
    allUsers.filter(user => user.isMentor && user.id !== currentUser.id), 
    [allUsers, currentUser]
  );
  
  const filteredMentors = useMemo(() => {
    if (!searchQuery) return mentors;
    return mentors.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.major.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mentors, searchQuery]);

  const handleToggleExpand = (mentorId: string) => {
    setExpandedMentorId(prevId => prevId === mentorId ? null : mentorId);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white pt-8">
        <div className="container mx-auto px-4">
             <BackButton onClick={handleBack} className="mb-4 text-white hover:text-indigo-200" text="Back" />
            {/* Banner */}
             <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 md:p-12 flex flex-col md:flex-row justify-between items-center relative overflow-hidden shadow-lg">
                <div className="absolute -left-16 -bottom-16 text-white/10">
                    <UserGroupIcon className="w-48 h-48 transform -rotate-12" />
                </div>
                <div className="z-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold">Find Your Mentor</h1>
                    <p className="text-sm md:text-base text-indigo-200 mt-2 max-w-lg">Connect with experienced peers and professionals to guide your journey.</p>
                </div>
                 <div className="z-10 mt-4 md:mt-0">
                    <button 
                        onClick={onOpenBecomeMentorModal}
                        className="bg-white text-purple-700 font-bold py-3 px-6 rounded-full flex items-center space-x-2 hover:bg-purple-100 transition-colors shadow-md"
                    >
                        <AcademicCapIcon className="w-6 h-6" />
                        <span>Become a Mentor</span>
                    </button>
                </div>
            </div>
             {/* Search Bar */}
            <div className="transform -translate-y-1/2 my-8">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-2 pl-5 flex items-center">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, department, or area of expertise..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-gray-700 py-2 px-4 text-base focus:outline-none"
                    />
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 -mt-16 md:-mt-12">
        {filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map(user => {
                  const isRequestSent = sentMentorshipRequests.some(req => req.toMentor.id === user.id && req.status === 'pending');
                  return (
                    <MentorCard 
                        key={user.id} 
                        mentor={user} 
                        isExpanded={expandedMentorId === user.id}
                        onToggleExpand={handleToggleExpand}
                        onSendRequest={onSendMentorshipRequest}
                        onRequestSent={isRequestSent}
                        onNavigateToProfile={() => onNavigate('profile', user)}
                    />
                  )
              })}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
              <p>No mentors found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorsPage;