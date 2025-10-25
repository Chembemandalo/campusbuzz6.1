import React from 'react';
import { HeroSlide, Page } from '../types';
import HeroSlider from '../components/HeroSlider';
import Footer from '../components/Footer';
import { 
    BookOpenIcon, 
    UserIcon, 
    PlusCircleIcon, 
    BriefcaseIcon,
    SearchIcon
} from '../components/icons';

interface HomePageProps {
  onJoin: () => void;
  slides: HeroSlide[];
  onNavigate: (page: Page) => void;
}

const QuickActionCard = ({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick: () => void }) => (
    <div onClick={onClick} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center">
        <div className="flex justify-center items-center h-16 w-16 mx-auto bg-indigo-100 rounded-full text-indigo-600">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mt-4">{title}</h3>
        <p className="text-gray-600 mt-2 text-sm">{description}</p>
    </div>
);

const InnovateCard = ({ image, category, title, onClick }: { image: string, category: string, title: string, onClick: () => void }) => (
    <div onClick={onClick} className="relative rounded-lg overflow-hidden shadow-lg group cursor-pointer h-80">
        <img src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
            <span className="text-sm font-semibold uppercase tracking-wider text-yellow-300">{category}</span>
            <h3 className="text-2xl font-bold mt-1">{title}</h3>
        </div>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ onJoin, slides, onNavigate }) => {
  return (
    <div className="bg-gray-50">
      {/* Search Bar Section */}
      <div className="bg-slate-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-full shadow-md p-2 flex items-center">
            <input 
              type="text" 
              placeholder="Search for jobs, events, courses..."
              className="w-full bg-transparent text-gray-600 py-2 px-6 text-base focus:outline-none"
            />
            <button className="bg-indigo-700 text-white font-semibold rounded-full py-3 px-6 hover:bg-purple-800 transition-colors flex items-center space-x-2 flex-shrink-0">
              <SearchIcon className="w-5 h-5"/>
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      <HeroSlider slides={slides} />

      <main className="container mx-auto px-4 py-16">
        {/* Quick Actions Section */}
        <section className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Quick Actions</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Get started with Campus Buzz by exploring our key features designed for the Rockview community.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
                <QuickActionCard 
                    icon={<BookOpenIcon className="w-8 h-8"/>}
                    title="Prep Hub"
                    description="Access study materials, practice tests, and preparation guides."
                    onClick={() => onNavigate('blog')}
                />
                 <QuickActionCard 
                    icon={<UserIcon className="w-8 h-8"/>}
                    title="Become a Mentor"
                    description="Share your expertise and guide students on their journey."
                    onClick={() => onNavigate('mentors')}
                />
                 <QuickActionCard 
                    icon={<PlusCircleIcon className="w-8 h-8"/>}
                    title="Create Account"
                    description="Sign up to access all features and personalized content."
                    onClick={onJoin}
                />
                 <QuickActionCard 
                    icon={<BriefcaseIcon className="w-8 h-8"/>}
                    title="Hiring Campus Ambassador"
                    description="Apply now to represent Campus Buzz at Rockview University."
                    onClick={() => onNavigate('jobs')}
                />
            </div>
        </section>
        
        {/* Innovate & Learn Section */}
        <section className="mt-20 text-center">
             <h2 className="text-3xl font-bold text-gray-800">Innovate & Learn</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Discover stories, research, and opportunities from the heart of the university.</p>
            <div className="grid md:grid-cols-3 gap-8 mt-10">
                <InnovateCard
                    image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop"
                    category="Campus Buzz"
                    title="Mentors"
                    onClick={() => onNavigate('blog')}
                />
                <InnovateCard
                    image="https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=2070&auto=format&fit=crop"
                    category="AI Defense"
                    title="Cisco Unveils AI Defense to Secure the AI"
                    onClick={() => onNavigate('blog')}
                />
                <InnovateCard
                    image="https://images.unsplash.com/photo-1563207009-66d49122a000?q=80&w=2070&auto=format&fit=crop"
                    category="Transportation"
                    title="Flying electric taxis look set to finally take off in 2025"
                    onClick={() => onNavigate('blog')}
                />
            </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default HomePage;