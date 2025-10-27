import React from 'react';
import { Page } from '../types';
import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from './icons';

interface FooterProps {
    onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="bg-gradient-to-t from-blue-100 to-blue-50 text-gray-700">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Column 1: About */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <h3 className="font-bold text-xl text-gray-800 mb-4">CAMPUS BUZZ</h3>
                        <p className="text-sm text-gray-600">
                            Your comprehensive campus connection, bringing together students, alumni, and opportunities. Discover jobs, events, resources, and mentorship all in one place.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" onClick={(e) => {e.preventDefault(); onNavigate('jobs')}} className="hover:text-indigo-600">Job Opportunities</a></li>
                            {/* FIX: Changed onNavigate('community') to onNavigate('home') as 'community' is not a valid Page type. */}
                            <li><a href="#" onClick={(e) => {e.preventDefault(); onNavigate('home')}} className="hover:text-indigo-600">Campus Updates</a></li>
                            <li><a href="#" onClick={(e) => {e.preventDefault(); onNavigate('blog')}} className="hover:text-indigo-600">Prep Hub</a></li>
                            <li><a href="#" onClick={(e) => {e.preventDefault(); onNavigate('mentors')}} className="hover:text-indigo-600">Find a Mentor</a></li>
                            <li><a href="#" onClick={(e) => {e.preventDefault(); onNavigate('events')}} className="hover:text-indigo-600">Competitions</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-4">Resources</h4>
                         <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-indigo-600">Alumni Network</a></li>
                            <li><a href="#" className="hover:text-indigo-600">Learnly Platform</a></li>
                            <li><a href="#" className="hover:text-indigo-600">Campus Ambassador</a></li>
                            <li><a href="#" className="hover:text-indigo-600">Career Guides</a></li>
                            <li><a href="#" className="hover:text-indigo-600">Study Materials</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Connect */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-4">Connect With Us</h4>
                        <div className="flex space-x-4 mb-4 text-gray-500">
                            <a href="#" className="hover:text-indigo-600"><FacebookIcon /></a>
                            <a href="#" className="hover:text-indigo-600"><TwitterIcon /></a>
                            <a href="#" className="hover:text-indigo-600"><InstagramIcon /></a>
                            <a href="#" className="hover:text-indigo-600"><LinkedInIcon /></a>
                            <a href="#" className="hover:text-indigo-600"><YouTubeIcon /></a>
                        </div>
                         <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="mailto:support@campusbuzz.site" className="hover:text-indigo-600">support@campusbuzz.site</a></li>
                            <li><a href="tel:+91XXXXXXXXXX" className="hover:text-indigo-600">+91 XXXXXXXXXX</a></li>
                            <li><p>IIT Kharagpur</p></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} CampusBuzz. All rights reserved.</p>
                     <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mt-2">
                        <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('privacy')}} className="hover:text-indigo-600">Privacy Policy</a>
                        <span>&middot;</span>
                        <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('terms')}} className="hover:text-indigo-600">Terms of Service</a>
                        <span>&middot;</span>
                        <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('cookies')}} className="hover:text-indigo-600">Cookie Policy</a>
                        <span>&middot;</span>
                        <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('sitemap')}} className="hover:text-indigo-600">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;