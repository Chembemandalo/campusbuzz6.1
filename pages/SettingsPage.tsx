import React, { useState, useEffect } from 'react';
import { User, UserSettings } from '../types';
import { 
    UserCircleIcon,
    PaintBrushIcon,
    ShieldCheckIcon,
    BellAlertIcon,
    SpinnerIcon,
} from '../components/icons';

interface SettingsPageProps {
  currentUser: User;
  onUpdateSettings: (updatedSettings: Partial<UserSettings>) => Promise<void>;
}

type SettingsTab = 'account' | 'preferences' | 'privacy' | 'notifications';

const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [settings, setSettings] = useState<UserSettings>(currentUser.settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSettings(currentUser.settings);
  }, [currentUser.settings]);

  const handleSettingsChange = async (newSettings: Partial<UserSettings>) => {
    setIsSaving(true);
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    await onUpdateSettings(updatedSettings);
    // Add a slight delay to show saving indicator
    setTimeout(() => setIsSaving(false), 500);
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountSettingsTab />;
      case 'preferences':
        return <PreferencesSettingsTab settings={settings} onSettingsChange={handleSettingsChange} />;
      case 'privacy':
        return <PrivacySettingsTab settings={settings} onSettingsChange={handleSettingsChange} />;
      case 'notifications':
        return <NotificationsSettingsTab settings={settings} onSettingsChange={handleSettingsChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <div className="bg-white p-3 rounded-lg shadow-sm sticky top-28">
              <nav className="space-y-1">
                <TabButton icon={UserCircleIcon} label="Account" isActive={activeTab === 'account'} onClick={() => setActiveTab('account')} />
                <TabButton icon={PaintBrushIcon} label="Preferences" isActive={activeTab === 'preferences'} onClick={() => setActiveTab('preferences')} />
                <TabButton icon={ShieldCheckIcon} label="Privacy" isActive={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')} />
                <TabButton icon={BellAlertIcon} label="Notifications" isActive={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
              </nav>
            </div>
          </aside>
          <main className="lg:col-span-9">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                {renderContent()}
            </div>
            {isSaving && (
                <div className="mt-4 flex items-center justify-end space-x-2 text-sm text-gray-500">
                    <SpinnerIcon className="w-4 h-4 text-gray-500" />
                    <span>Saving...</span>
                </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ icon: Icon, label, isActive, onClick }: { icon: React.FC<{className?: string}>, label: string, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`w-full flex items-center p-3 rounded-md text-left transition-colors ${isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
        <Icon className="w-5 h-5 mr-3" />
        <span>{label}</span>
    </button>
);

const SectionTitle: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
);

const AccountSettingsTab = () => (
    <div className="space-y-8">
        <SectionTitle title="Account Information" description="Update your account details." />
        <form className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input type="text" defaultValue="janedoe" className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" defaultValue="jane.doe@rockview.edu" className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
             <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Changes</button>
        </form>
        <SectionTitle title="Change Password" description="Choose a strong, new password." />
         <form className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">Old Password</label>
                <input type="password" placeholder="••••••••" className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" placeholder="••••••••" className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
             <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Update Password</button>
        </form>
         <SectionTitle title="Account Removal" description="Permanently delete your account." />
         <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete Account</button>
    </div>
);

const PreferencesSettingsTab: React.FC<{ settings: UserSettings, onSettingsChange: (s: Partial<UserSettings>) => void }> = ({ settings, onSettingsChange }) => (
     <div className="space-y-8">
        <SectionTitle title="Appearance" description="Customize the look and feel of the app." />
        <div>
            <label className="block text-sm font-medium text-gray-700">Theme</label>
            <div className="mt-2 flex space-x-4">
                <RadioPill id="light" name="theme" label="Light" checked={settings.theme === 'light'} onChange={() => onSettingsChange({ theme: 'light' })} />
                <RadioPill id="dark" name="theme" label="Dark" checked={settings.theme === 'dark'} onChange={() => onSettingsChange({ theme: 'dark' })} />
            </div>
        </div>
        <SectionTitle title="Localization" description="Set your language and timezone." />
         <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
            <select id="language" name="language" className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
            </select>
        </div>
         <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
             <select id="timezone" name="timezone" className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option>America/New_York (ET)</option>
                <option>America/Chicago (CT)</option>
                <option>America/Denver (MT)</option>
                 <option>America/Los_Angeles (PT)</option>
            </select>
        </div>
    </div>
);

const PrivacySettingsTab: React.FC<{ settings: UserSettings, onSettingsChange: (s: Partial<UserSettings>) => void }> = ({ settings, onSettingsChange }) => (
    <div className="space-y-8">
        <SectionTitle title="Profile Privacy" description="Control who sees your information." />
        <SettingToggle
            title="Profile Visibility"
            description="Control who can see your full profile."
            enabled={settings.profileVisibility === 'public'}
            onToggle={(e) => onSettingsChange({ profileVisibility: e.target.checked ? 'public' : 'friends' })}
            labels={{ on: 'Public', off: 'Friends Only' }}
        />
        <SettingToggle
            title="Friend Request Permissions"
            description="Control who is able to send you friend requests."
            enabled={settings.allowFriendRequests === 'everyone'}
            onToggle={(e) => onSettingsChange({ allowFriendRequests: e.target.checked ? 'everyone' : 'friendsOfFriends' })}
            labels={{ on: 'Everyone', off: 'Friends of Friends' }}
        />
         <SettingToggle
            title="Search Engine Indexing"
            description="Allow your profile to be indexed by search engines like Google."
            enabled={settings.allowSearchIndexing}
            onToggle={(e) => onSettingsChange({ allowSearchIndexing: e.target.checked })}
        />
    </div>
);

const NotificationsSettingsTab: React.FC<{ settings: UserSettings, onSettingsChange: (s: Partial<UserSettings>) => void }> = ({ settings, onSettingsChange }) => (
    <div className="space-y-8">
        <SectionTitle title="Activity Notifications" description="Choose which activities you want to be notified about." />
        <SettingToggle
            title="New Posts"
            description="Notify me when someone I follow creates a new post."
            enabled={settings.notifications.newPost}
            onToggle={(e) => onSettingsChange({ notifications: { ...settings.notifications, newPost: e.target.checked } })}
        />
        <SettingToggle
            title="Friend Requests"
            description="Notify me when someone sends me a friend request."
            enabled={settings.notifications.newFriendRequest}
            onToggle={(e) => onSettingsChange({ notifications: { ...settings.notifications, newFriendRequest: e.target.checked } })}
        />
        <SettingToggle
            title="Comments on My Posts"
            description="Notify me when someone comments on one of my posts."
            enabled={settings.notifications.commentOnPost}
            onToggle={(e) => onSettingsChange({ notifications: { ...settings.notifications, commentOnPost: e.target.checked } })}
        />
        <SettingToggle
            title="Event Reminders"
            description="Send me reminders for events I have RSVP'd to."
            enabled={settings.notifications.eventReminder}
            onToggle={(e) => onSettingsChange({ notifications: { ...settings.notifications, eventReminder: e.target.checked } })}
        />
        <SettingToggle
            title="Marketplace Updates"
            description="Notify me about activity on my marketplace listings."
            enabled={settings.notifications.marketplaceUpdate}
            onToggle={(e) => onSettingsChange({ notifications: { ...settings.notifications, marketplaceUpdate: e.target.checked } })}
        />
    </div>
);

const RadioPill: React.FC<{ id: string, name: string, label: string, checked: boolean, onChange: () => void }> = ({ id, name, label, checked, onChange }) => (
    <div>
        <input type="radio" id={id} name={name} checked={checked} onChange={onChange} className="sr-only" />
        <label htmlFor={id} className={`px-4 py-2 rounded-full cursor-pointer transition-colors ${checked ? 'bg-indigo-600 text-white font-semibold' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            {label}
        </label>
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

export default SettingsPage;
