import React, { useState } from 'react';
import { User, MentorshipRequest, Group, Page, Article } from '../types';
import { UsersIcon, UserGroupIcon, CheckIcon, XMarkIcon, SpinnerIcon, Cog6ToothIcon, ChartBarIcon, StarIcon, PencilSquareIcon, TrashIcon } from '../components/icons';

interface MentorDashboardPageProps {
  currentUser: User;
  requests: MentorshipRequest[];
  groups: Group[];
  allUsers: User[];
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
  onCreateCommunity: (name: string, description: string) => Promise<void>;
  onUpdateSettings: (mentorId: string, settings: Partial<Pick<User, 'acceptingNewMentees'>>) => Promise<void>;
  onRemoveMentee: (groupId: string, menteeId: string) => Promise<void>;
  onUpdateCommunity: (groupId: string, details: Partial<Pick<Group, 'name' | 'description'>>) => Promise<void>;
  onNavigate: (page: Page, data?: User | Article) => void;
}

type MentorTab = 'overview' | 'requests' | 'community' | 'settings';

const MentorDashboardPage: React.FC<MentorDashboardPageProps> = (props) => {
  const { requests } = props;
  const [activeTab, setActiveTab] = useState<MentorTab>('overview');
  
  const pendingRequests = requests.filter(r => r.status === 'pending');

  const renderContent = () => {
    switch(activeTab) {
      case 'requests':
        return <RequestsTab requests={pendingRequests} {...props} />;
      case 'community':
        return <CommunityTab {...props} />;
      case 'settings':
        return <SettingsTab {...props} />;
      case 'overview':
      default:
        return <OverviewTab {...props} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mentor Dashboard</h1>
        <p className="text-gray-600 mb-6">Manage your mentorship requests and community.</p>
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <TabButton icon={ChartBarIcon} label="Overview" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
              <TabButton icon={UsersIcon} label="Requests" count={pendingRequests.length} isActive={activeTab === 'requests'} onClick={() => setActiveTab('requests')} />
              <TabButton icon={UserGroupIcon} label="My Community" isActive={activeTab === 'community'} onClick={() => setActiveTab('community')} />
              <TabButton icon={Cog6ToothIcon} label="Settings" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
            </nav>
          </div>
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ icon: React.FC<{className?: string}>, label: string, count?: number, isActive: boolean, onClick: () => void }> = ({ icon: Icon, label, count, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex items-center space-x-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${isActive ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
    >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
        {typeof count !== 'undefined' && count > 0 && (
            <span className={`text-xs rounded-full px-2 py-0.5 ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{count}</span>
        )}
    </button>
);

const SectionTitle: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
    <div className="pb-4 border-b border-gray-200 mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
);

const StatCard: React.FC<{ title: string, value: string | number, icon: React.FC<{className?: string}> }> = ({ title, value, icon: Icon }) => (
    <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between border border-gray-200">
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
            <Icon className="w-6 h-6" />
        </div>
    </div>
);

const OverviewTab: React.FC<MentorDashboardPageProps> = ({ currentUser, requests, groups }) => {
    const myCommunity = groups.find(g => g.id === currentUser.mentorshipCommunityId);
    const totalMentees = myCommunity ? myCommunity.members.filter(id => id !== currentUser.id).length : 0;
    const pendingRequests = requests.filter(r => r.status === 'pending');
    
    return (
        <div>
            <SectionTitle title="Overview" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Mentees" value={totalMentees} icon={UserGroupIcon} />
                <StatCard title="Pending Requests" value={pendingRequests.length} icon={UsersIcon} />
                <StatCard title="Average Rating" value={`${currentUser.rating?.score.toFixed(1) || 'N/A'}`} icon={StarIcon} />
            </div>
        </div>
    );
}

const RequestsTab: React.FC<Pick<MentorDashboardPageProps, 'requests' | 'onAccept' | 'onDecline' | 'onNavigate'>> = ({ requests, onAccept, onDecline, onNavigate }) => {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <UsersIcon className="mx-auto w-12 h-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No Pending Requests</h3>
        <p className="mt-1 text-sm">You have no new requests to join your community.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map(req => (
        <div key={req.id} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => onNavigate('profile', req.fromUser)}
          >
            <img src={req.fromUser.avatarUrl} alt={req.fromUser.name} className="w-12 h-12 rounded-full" />
            <div className="ml-4">
              <p className="font-semibold text-gray-800 group-hover:text-indigo-600 group-hover:underline">{req.fromUser.name}</p>
              <p className="text-sm text-gray-500">{req.fromUser.department}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => onAccept(req.id)} className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200"><CheckIcon className="w-5 h-5"/></button>
            <button onClick={() => onDecline(req.id)} className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200"><XMarkIcon className="w-5 h-5" /></button>
          </div>
        </div>
      ))}
    </div>
  );
};

const CommunityTab: React.FC<MentorDashboardPageProps> = (props) => {
    const { currentUser, groups, allUsers, onCreateCommunity, onRemoveMentee, onUpdateCommunity, onNavigate } = props;
    const [name, setName] = useState(`${currentUser.name}'s Mentorship`);
    const [description, setDescription] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const myCommunity = groups.find(g => g.id === currentUser.mentorshipCommunityId);
    
    if (!myCommunity) {
        const handleCreate = async () => {
            if (!name.trim() || !description.trim() || isCreating) return;
            setIsCreating(true);
            await onCreateCommunity(name, description);
            setIsCreating(false);
        };
        return (
            <div className="max-w-lg mx-auto text-center py-8">
                 <UserGroupIcon className="mx-auto w-12 h-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">Create Your Mentorship Community</h3>
                <p className="mt-1 text-sm text-gray-500 mb-6">This will be a private group for you and your mentees to interact.</p>
                <div className="space-y-4 text-left">
                     <div>
                        <label htmlFor="community-name" className="block text-sm font-medium text-gray-700">Community Name</label>
                        <input type="text" id="community-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="community-desc" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="community-desc" rows={3} value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="e.g., A space for aspiring software engineers to ask questions and share resources."></textarea>
                    </div>
                    <button onClick={handleCreate} disabled={isCreating} className="w-full bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 flex justify-center items-center">
                        {isCreating ? <SpinnerIcon /> : 'Create Community'}
                    </button>
                </div>
            </div>
        )
    }
    
    const members = allUsers.filter(u => myCommunity.members.includes(u.id));
    const handleSaveEdit = async () => {
        if (!name.trim() || !description.trim()) return;
        await onUpdateCommunity(myCommunity.id, { name, description });
        setIsEditing(false);
    }
    
    const handleStartEdit = () => {
        setName(myCommunity.name);
        setDescription(myCommunity.description);
        setIsEditing(true);
    }

    return (
        <div>
            {isEditing ? (
                <div className="space-y-4">
                    <div>
                        <label htmlFor="edit-community-name" className="block text-sm font-medium text-gray-700">Community Name</label>
                        <input type="text" id="edit-community-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="edit-community-desc" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="edit-community-desc" rows={3} value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></textarea>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold">Cancel</button>
                        <button onClick={handleSaveEdit} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Save Changes</button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold mb-1">{myCommunity.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{myCommunity.description}</p>
                    </div>
                    <button onClick={handleStartEdit} className="flex items-center space-x-1 text-sm text-indigo-600 font-semibold hover:underline">
                        <PencilSquareIcon className="w-4 h-4" />
                        <span>Edit</span>
                    </button>
                </div>
            )}

            <h4 className="font-semibold text-gray-800 mt-6 mb-2 border-t pt-4">Members ({members.length})</h4>
            <div className="space-y-3">
                {members.map(member => (
                    <div key={member.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                        <div 
                            className="flex items-center cursor-pointer group"
                            onClick={() => onNavigate('profile', member)}
                        >
                            <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full" />
                            <div className="ml-3">
                                 <p className="font-semibold text-sm text-gray-800 group-hover:text-indigo-600 group-hover:underline">{member.name} {member.id === currentUser.id && '(You)'}</p>
                                 <p className="text-xs text-gray-500">{member.major}</p>
                            </div>
                        </div>
                        {member.id !== currentUser.id && (
                            <button onClick={() => onRemoveMentee(myCommunity.id, member.id)} className="p-2 text-red-500 rounded-full hover:bg-red-100">
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const SettingsTab: React.FC<MentorDashboardPageProps> = ({ currentUser, onUpdateSettings }) => (
    <div>
        <SectionTitle title="Mentorship Settings" description="Control your availability and other mentorship preferences." />
        <SettingToggle
            title="Accepting New Mentees"
            description="Control whether new students can send you mentorship requests."
            enabled={!!currentUser.acceptingNewMentees}
            onToggle={(e) => onUpdateSettings(currentUser.id, { acceptingNewMentees: e.target.checked })}
            labels={{ on: 'Available', off: 'Unavailable' }}
        />
    </div>
);

const SettingToggle: React.FC<{ title: string, description: string, enabled: boolean, onToggle: (e: React.ChangeEvent<HTMLInputElement>) => void, labels?: { on?: string, off?: string } }> = ({ title, description, enabled, onToggle, labels }) => (
    <div className="flex justify-between items-start pt-4 border-t border-gray-200">
        <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <ToggleSwitch enabled={enabled} onToggle={onToggle} onLabel={labels?.on} offLabel={labels?.off} />
    </div>
);

const ToggleSwitch = ({ enabled, onToggle, onLabel = 'On', offLabel = 'Off' } : { enabled: boolean, onToggle: (e: React.ChangeEvent<HTMLInputElement>) => void, onLabel?: string, offLabel?: string }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={enabled} onChange={onToggle} className="sr-only peer" />
        <div className="w-14 h-7 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900 w-20 text-left">{enabled ? onLabel : offLabel}</span>
    </label>
);

export default MentorDashboardPage;