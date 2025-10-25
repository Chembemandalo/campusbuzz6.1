import React from 'react';
import { User } from '../types';
import { StarIcon, AcademicCapIcon, BriefcaseIcon, CalendarDaysIcon, ClockIcon } from './icons';

interface MentorCardProps {
  mentor: User;
  isExpanded: boolean;
  onToggleExpand: (mentorId: string) => void;
  onSendRequest: (mentorId: string) => void;
  onRequestSent: boolean;
  onNavigateToProfile: (mentor: User) => void;
}

const InfoRow: React.FC<{icon: React.FC<{className?: string}>, label: string, value: string | number | undefined}> = ({ icon: Icon, label, value }) => {
    if (!value) return null;
    return (
        <div className="flex items-start text-sm">
            <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="ml-3">
                <p className="font-semibold text-gray-800">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
            </div>
        </div>
    );
};


const MentorCard: React.FC<MentorCardProps> = ({ mentor, isExpanded, onToggleExpand, onSendRequest, onRequestSent, onNavigateToProfile }) => {
  return (
    <div 
        className="bg-white rounded-lg shadow-sm flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        onClick={() => onToggleExpand(mentor.id)}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center">
          <img 
            src={mentor.avatarUrl} 
            alt={mentor.name} 
            className="w-16 h-16 rounded-full"
          />
          <div className="ml-4">
            <h3 
                className="font-bold text-lg text-gray-900 hover:text-indigo-600"
            >
                {mentor.name}
            </h3>
            {mentor.rating && (
                 <div className="flex items-center mt-1">
                    <div className="flex">
                        {[...Array(Math.round(mentor.rating.score))].map((_, i) => (
                            <StarIcon key={`full-${i}`} className="w-4 h-4 text-yellow-400" />
                        ))}
                        {[...Array(5 - Math.round(mentor.rating.score))].map((_, i) => (
                            <StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
                        ))}
                    </div>
                    <span className="text-gray-500 text-xs ml-1.5 font-semibold">
                        {mentor.rating.score.toFixed(1)} ({mentor.rating.reviews})
                    </span>
                </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className="p-4 space-y-4 flex-grow">
        <InfoRow icon={BriefcaseIcon} label="Department" value={mentor.department} />
        <InfoRow icon={AcademicCapIcon} label="Institute" value={mentor.institute} />
        <InfoRow icon={CalendarDaysIcon} label="Joining Year" value={mentor.joiningYear} />
        <InfoRow icon={CalendarDaysIcon} label="Passing Year" value={mentor.passingYear} />
      </div>
      
      {/* Expandable Section */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-screen' : 'max-h-0'}`}>
         <div className="px-4 pb-4">
            <div className="mt-2 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">About</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{mentor.bio}</p>
            </div>
         </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 rounded-b-lg flex items-center justify-between">
        <div>
            <p className="text-xl font-bold text-indigo-700">
                {mentor.sessionFee === 0 ? 'Free' : `$${mentor.sessionFee}`}
            </p>
            <p className="text-xs text-gray-500">per 60 min session</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onSendRequest(mentor.id); }}
          disabled={onRequestSent || !mentor.acceptingNewMentees}
          className="bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {onRequestSent ? 'Request Sent' : !mentor.acceptingNewMentees ? 'Unavailable' : 'Book Session'}
        </button>
      </div>
    </div>
  );
};

export default MentorCard;