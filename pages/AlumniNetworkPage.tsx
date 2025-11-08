import React, { useState, useMemo } from 'react';
import { User, Page, Article } from '../types';
import { AcademicCapIcon, BriefcaseIcon, MapPinIcon, SearchIcon, BackButton } from '../components/icons';

interface AlumniNetworkPageProps {
  allUsers: User[];
  onNavigate: (page: Page, data?: User | Article) => void;
  handleBack: () => void;
}

const AlumniCard: React.FC<{ alumni: User; onNavigate: (page: Page, data?: User) => void }> = ({ alumni, onNavigate }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden text-center p-6 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <img src={alumni.avatarUrl} alt={alumni.name} className="w-24 h-24 mx-auto rounded-full border-4 border-gray-200 group-hover:border-indigo-400 transition-colors" />
        <h3 className="mt-4 text-lg font-bold text-gray-800">{alumni.name}</h3>
        <p className="text-sm text-gray-500">Class of {alumni.passingYear}</p>
        <p className="text-xs text-gray-400 mt-1">{alumni.major}</p>

        <div className="mt-4 pt-4 border-t border-gray-100 text-left space-y-2">
            <div className="flex items-center text-sm text-gray-700">
                <BriefcaseIcon className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span className="truncate">Software Engineer at Tech Solutions Inc.</span>
            </div>
        </div>
        
        <div className="mt-4">
            <button
                onClick={() => onNavigate('profile', alumni)}
                className="w-full bg-indigo-50 text-indigo-700 font-semibold px-3 py-2 rounded-lg text-sm hover:bg-indigo-100 transition-colors"
            >
                View Profile
            </button>
        </div>
    </div>
);

const AlumniNetworkPage: React.FC<AlumniNetworkPageProps> = ({ allUsers, onNavigate, handleBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ year: 'All', industry: 'All' });

    const alumni = useMemo(() => {
        const currentYear = new Date().getFullYear();
        // Assuming anyone with a passing year in the past is an alumnus
        return allUsers.filter(user => user.passingYear && user.passingYear < currentYear);
    }, [allUsers]);

    const filteredAlumni = useMemo(() => {
        return alumni.filter(user => {
            const nameMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
            // These filters are placeholders as the data isn't in the user model yet.
            const yearMatch = filters.year === 'All' || user.passingYear === parseInt(filters.year);
            const industryMatch = filters.industry === 'All'; // No industry data in model

            return nameMatch && yearMatch && industryMatch;
        });
    }, [alumni, searchTerm, filters]);
    
    const uniqueYears = useMemo(() => {
        const years = new Set(alumni.map(a => a.passingYear).filter(y => y));
        return Array.from(years).sort((a,b) => b! - a!);
    }, [alumni]);

    const industries = ['All', 'Technology', 'Healthcare', 'Finance', 'Education', 'Arts'];

    // Mock featured alumni and events
    const featuredAlumni = alumni.slice(0, 2);
    const alumniEvents = [
        { id: 'ae1', title: 'Annual Alumni Gala', date: 'December 15, 2024', location: 'Grand Ballroom, Downtown' },
        { id: 'ae2', title: 'NYC Chapter Networking Mixer', date: 'January 20, 2025', location: 'The Liberty, NYC' },
    ];

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white pt-8">
                <div className="container mx-auto px-4">
                    <BackButton onClick={handleBack} className="mb-4 text-white hover:text-gray-300" />
                    <div className="text-center py-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Rockview Alumni Network</h1>
                        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">Connect with thousands of graduates making an impact across the globe.</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-12 -mt-16">
                {/* Filter and Search Bar */}
                <div className="bg-white rounded-lg shadow-xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="relative flex-grow min-w-[250px]">
                        <input
                            type="text"
                            placeholder="Search by name, company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                        <select value={filters.year} onChange={e => setFilters({...filters, year: e.target.value})} className="bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="All">All Years</option>
                            {uniqueYears.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                         <select value={filters.industry} onChange={e => setFilters({...filters, industry: e.target.value})} className="bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                        </select>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <main className="lg:col-span-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{filteredAlumni.length} Alumni Found</h2>
                         {filteredAlumni.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredAlumni.map(user => (
                                    <AlumniCard key={user.id} alumni={user} onNavigate={onNavigate} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
                                <p>No alumni found matching your criteria.</p>
                            </div>
                        )}
                    </main>

                    <aside className="lg:col-span-4 space-y-8">
                        {/* Featured Alumni */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Featured Alumni</h3>
                            <div className="space-y-4">
                                {featuredAlumni.map(alumni => (
                                    <div key={alumni.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
                                        <img src={alumni.avatarUrl} alt={alumni.name} className="w-14 h-14 rounded-full" />
                                        <div>
                                            <p className="font-bold text-gray-800">{alumni.name}</p>
                                            <p className="text-sm text-gray-500">{alumni.major}, '{String(alumni.passingYear).slice(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        <div>
                             <h3 className="text-xl font-bold text-gray-800 mb-4">Alumni Events</h3>
                             <div className="space-y-4">
                                {alumniEvents.map(event => (
                                    <div key={event.id} className="bg-white p-4 rounded-lg shadow-sm">
                                        <p className="font-bold text-gray-800">{event.title}</p>
                                        <p className="text-sm text-gray-500 mt-1">{event.date} &bull; {event.location}</p>
                                        <button className="text-sm text-indigo-600 font-semibold mt-2 hover:underline">Learn More &rarr;</button>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default AlumniNetworkPage;
