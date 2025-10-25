import React from 'react';
import { Page } from '../types';
import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from './icons';

interface FooterProps {
    onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="bg-gray-800 text-gray-300">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Column 1: About */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <h3 className="font-bold text-xl text-white mb-4">CAMPUS BUZZ</h3>
                        <p className="text-sm">
                            Your comprehensive campus connection, bringing together students, alumni, and opportunities. Discover jobs, events, resources, and mentorship all in one place.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" onClick={(e) => {e.preventDefault(); onNavigate('jobs')}} className="hover:text-white">Job Opportunities</a></li>
                            <li><a href="#" onClick={(e) => {e.preventDefault(); onNavigate('newsfeed')}} className="hover:text-white">Campus Updates</a></li>
                            <li><a href="#" onClick={(e) => {e.preventDefault(); onNavigate('blog')}} className="hover:text-white">Prep Hub</a></li>
                            <li><a href="#" onClick={(e) => {e.preventDefault(); onNavigate('mentors')}} className="hover:text-white">Find a Mentor</a></li>
                            <li><a href="#" onClick={(e) => {e.preventDefault(); onNavigate('events')}} className="hover:text-white">Competitions</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Resources</h4>
                         <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white">Alumni Network</a></li>
                            <li><a href="#" className="hover:text-white">Learnly Platform</a></li>
                            <li><a href="#" className="hover:text-white">Campus Ambassador</a></li>
                            <li><a href="#" className="hover:text-white">Career Guides</a></li>
                            <li><a href="#" className="hover:text-white">Study Materials</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Connect */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Connect With Us</h4>
                        <div className="flex space-x-4 mb-4">
                            <a href="#" className="hover:text-white"><FacebookIcon /></a>
                            <a href="#" className="hover:text-white"><TwitterIcon /></a>
                            <a href="#" className="hover:text-white"><InstagramIcon /></a>
                            <a href="#" className="hover:text-white"><LinkedInIcon /></a>
                            <a href="#" className="hover:text-white"><YouTubeIcon /></a>
                        </div>
                         <ul className="space-y-2 text-sm">
                            <li><a href="mailto:support@campusbuzz.site" className="hover:text-white">support@campusbuzz.site</a></li>
                            <li><a href="tel:+91XXXXXXXXXX" className="hover:text-white">+91 XXXXXXXXXX</a></li>
                            <li><p>IIT Kharagpur</p></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} CampusBuzz. All rights reserved.</p>
                     <div className="flex justify-center space-x-4 mt-2">
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <span>&middot;</span>
                        <a href="#" className="hover:text-white">Terms of Service</a>
                        <span>&middot;</span>
                        <a href="#" className="hover:text-white">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;