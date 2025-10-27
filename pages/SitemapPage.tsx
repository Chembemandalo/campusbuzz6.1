import React from 'react';
import { Page } from '../types';
// FIX: Add BackButton to imports
import { BackButton } from '../components/icons';

interface SitemapPageProps {
  onNavigate: (page: Page) => void;
  // FIX: Add handleBack to props interface
  handleBack: () => void;
}

const SitemapLink: React.FC<{ page: Page, label: string, onNavigate: (page: Page) => void }> = ({ page, label, onNavigate }) => (
    <li>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(page); }} className="text-indigo-600 hover:underline">
            {label}
        </a>
    </li>
);

const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigate, handleBack }) => {
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* FIX: Add BackButton component */}
        <BackButton onClick={handleBack} className="mb-8" />
        <h1 className="text-3xl font-extrabold text-gray-900 text-center">Sitemap</h1>
        <p className="mt-2 text-center text-sm text-gray-500">Find your way around Campus Buzz.</p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Main Pages</h2>
            <ul className="mt-4 space-y-2">
              <SitemapLink page="home" label="Home" onNavigate={onNavigate} />
              {/* FIX: Changed page="community" to page="home" as 'community' is not a valid Page type. */}
              <SitemapLink page="home" label="Community Feed" onNavigate={onNavigate} />
              <SitemapLink page="contact" label="Contact Us" onNavigate={onNavigate} />
              <SitemapLink page="auth" label="Login / Register" onNavigate={onNavigate} />
            </ul>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Community & Social</h2>
            <ul className="mt-4 space-y-2">
              <SitemapLink page="profile" label="My Profile" onNavigate={onNavigate} />
              <SitemapLink page="chat" label="Inbox / Messages" onNavigate={onNavigate} />
              <SitemapLink page="friends" label="Friends" onNavigate={onNavigate} />
              <SitemapLink page="groups" label="Groups" onNavigate={onNavigate} />
              <SitemapLink page="gallery" label="Photo Gallery" onNavigate={onNavigate} />
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">Campus Resources</h2>
            <ul className="mt-4 space-y-2">
              <SitemapLink page="events" label="Events" onNavigate={onNavigate} />
              <SitemapLink page="marketplace" label="Marketplace" onNavigate={onNavigate} />
              <SitemapLink page="jobs" label="Jobs & Internships" onNavigate={onNavigate} />
              <SitemapLink page="mentors" label="Find a Mentor" onNavigate={onNavigate} />
              <SitemapLink page="lostandfound" label="Lost & Found" onNavigate={onNavigate} />
            </ul>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Academics & Tools</h2>
            <ul className="mt-4 space-y-2">
                <SitemapLink page="blog" label="News / Articles" onNavigate={onNavigate} />
                <SitemapLink page="library" label="Digital Library" onNavigate={onNavigate} />
                <SitemapLink page="classes" label="My Schedule" onNavigate={onNavigate} />
                <SitemapLink page="todolist" label="My Tasks" onNavigate={onNavigate} />
                <SitemapLink page="polls" label="Polls & Surveys" onNavigate={onNavigate} />
            </ul>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Account</h2>
            <ul className="mt-4 space-y-2">
                <SitemapLink page="settings" label="Settings" onNavigate={onNavigate} />
                <SitemapLink page="admin" label="Admin Dashboard" onNavigate={onNavigate} />
                <SitemapLink page="mentor-dashboard" label="Mentor Dashboard" onNavigate={onNavigate} />
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">Legal</h2>
            <ul className="mt-4 space-y-2">
                <SitemapLink page="privacy" label="Privacy Policy" onNavigate={onNavigate} />
                <SitemapLink page="terms" label="Terms of Service" onNavigate={onNavigate} />
                <SitemapLink page="cookies" label="Cookie Policy" onNavigate={onNavigate} />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;
