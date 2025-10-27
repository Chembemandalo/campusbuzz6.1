import React, { useState, useEffect } from 'react';
import { User, UserSettings } from '../types';
import { 
    UserCircleIcon,
    PaintBrushIcon,
    ShieldCheckIcon,
    BellAlertIcon,
    SpinnerIcon,
    BackButton,
} from '../components/icons';

interface SettingsPageProps {
  currentUser: User;
  onUpdateSettings: (updatedSettings: Partial<UserSettings>) => Promise<void>;
  handleBack: () => void;
}

type SettingsTab = 'account' | 'preferences' | 'privacy' | 'notifications';

// FIX: Define TabButton component
const TabButton: React.FC<{ icon: React.FC<{ className?: string }>; label: string; isActive: boolean; onClick: () => void; }> = ({ icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center p-3 rounded-lg text-left text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
    >
      <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} />
      <span>{label}</span>
    </button>
);

// FIX: Define AccountSettingsTab component
const AccountSettingsTab: React.FC = () => (
    <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Account</h2>
        <p>Manage your account settings here. More options coming soon!</p>
    </div>
);

const ToggleSwitch: React.FC<{ enabled: boolean; onToggle: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ enabled, onToggle }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={enabled} onChange={onToggle} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
    </label>
);

const SettingRow: React.FC<{ title: string, description: string, children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0">
        <div>
            <h4 className="font-semibold text-gray-800">{title}</h4>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div>{children}</div>
    </div>
);

// FIX: Define PreferencesSettingsTab component
const PreferencesSettingsTab: React.FC<{ settings: UserSettings; onSettingsChange: (newSettings: Partial<UserSettings>) => void; }> = ({ settings, onSettingsChange }) => (
    <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Preferences</h2>
        <SettingRow title="Theme" description="Choose your preferred interface theme.">
            <select
                value={settings.theme}
                disabled // Theme is forced to light in App.tsx
                onChange={e => onSettingsChange({ theme: e.target.value as 'light' | 'dark' })}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
            >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </SettingRow>
        <SettingRow title="Language" description="Select your language.">
            <select
                value={settings.language}
                onChange={e => onSettingsChange({ language: e.target.value as 'en-US' | 'es-ES' | 'fr-FR' })}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
                <option value="fr-FR">Français</option>
            </select>
        </SettingRow>
    </div>
);

// FIX: Define PrivacySettingsTab component
const PrivacySettingsTab: React.FC<{ settings: UserSettings; onSettingsChange: (newSettings: Partial<UserSettings>) => void; }> = ({ settings, onSettingsChange }) => (
     <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Privacy</h2>
        <SettingRow title="Profile Visibility" description="Control who can see your profile details.">
             <select
                value={settings.profileVisibility}
                onChange={e => onSettingsChange({ profileVisibility: e.target.value as 'public' | 'friends' })}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
            </select>
        </SettingRow>
         <SettingRow title="Friend Requests" description="Who can send you friend requests.">
            <select
                value={settings.allowFriendRequests}
                onChange={e => onSettingsChange({ allowFriendRequests: e.target.value as 'everyone' | 'friendsOfFriends' })}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
                <option value="everyone">Everyone</option>
                <option value="friendsOfFriends">Friends of Friends</option>
            </select>
        </SettingRow>
        <SettingRow title="Search Engine Indexing" description="Allow search engines to index your profile.">
            <ToggleSwitch
                enabled={settings.allowSearchIndexing}
                onToggle={e => onSettingsChange({ allowSearchIndexing: e.target.checked })}
            />
        </SettingRow>
    </div>
);

// FIX: Define NotificationsSettingsTab component
const NotificationsSettingsTab: React.FC<{ settings: UserSettings; onSettingsChange: (newSettings: Partial<UserSettings>) => void; }> = ({ settings, onSettingsChange }) => (
    <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Notifications</h2>
        <SettingRow title="New Posts" description="Notify me when someone I follow creates a new post.">
            <ToggleSwitch
                enabled={settings.notifications.newPost}
                onToggle={e => onSettingsChange({ notifications: { ...settings.notifications, newPost: e.target.checked } })}
            />
        </SettingRow>
         <SettingRow title="New Friend Request" description="Notify me when someone sends me a friend request.">
            <ToggleSwitch
                enabled={settings.notifications.newFriendRequest}
                onToggle={e => onSettingsChange({ notifications: { ...settings.notifications, newFriendRequest: e.target.checked } })}
            />
        </SettingRow>
         <SettingRow title="Comment on Post" description="Notify me when someone comments on my post.">
            <ToggleSwitch
                enabled={settings.notifications.commentOnPost}
                onToggle={e => onSettingsChange({ notifications: { ...settings.notifications, commentOnPost: e.target.checked } })}
            />
        </SettingRow>
        <SettingRow title="Event Reminders" description="Remind me about events I'm attending.">
            <ToggleSwitch
                enabled={settings.notifications.eventReminder}
                onToggle={e => onSettingsChange({ notifications: { ...settings.notifications, eventReminder: e.target.checked } })}
            />
        </SettingRow>
         <SettingRow title="Marketplace Updates" description="Notify me about activity on my listings.">
            <ToggleSwitch
                enabled={settings.notifications.marketplaceUpdate}
                onToggle={e => onSettingsChange({ notifications: { ...settings.notifications, marketplaceUpdate: e.target.checked } })}
            />
        </SettingRow>
    </div>
);

const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, onUpdateSettings, handleBack }) => {
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
        <BackButton onClick={handleBack} className="mb-4" />
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
                    <SpinnerIcon className="w-5 h-5 text-gray-400" />
                    <span>Saving...</span>
                </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// FIX: Export SettingsPage as the default export.
export default SettingsPage;
