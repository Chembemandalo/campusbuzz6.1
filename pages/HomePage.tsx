import React from 'react';
import { Page } from '../types';
import { ArrowRightIcon, AcademicCapIcon, BriefcaseIcon, ThumbtackIcon, ClockIcon, BookOpenIcon, MegaphoneIcon, SparklesIcon } from '../components/icons';

interface HomePageProps {
  onJoin: () => void;
  onNavigate: (page: Page) => void;
}

const NewsCard: React.FC<{img: string, category: string, title: string, onClick: () => void}> = ({img, category, title, onClick}) => (
    <div onClick={onClick} className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer">
        <img src={img} alt={title} className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out" />
        <div className="p-6">
            <p className="text-sm font-semibold text-indigo-600 mb-1">{category}</p>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">{title}</h3>
        </div>
    </div>
);

const AcademicCard: React.FC<{icon: React.FC<{className?: string}>, title: string, description: string, onClick: () => void, variant: 1 | 2 | 3}> = ({icon: Icon, title, description, onClick, variant}) => (
    <div onClick={onClick} className="bg-white p-8 rounded-lg shadow-md text-center transform hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden cursor-pointer">
        {/* Main background icon */}
        <Icon className="absolute -bottom-8 -right-8 w-32 h-32 text-gray-100/50 z-0 transform rotate-12" />
        
        {/* Playful Icons */}
        {variant === 1 && <>
            <BookOpenIcon className="absolute top-5 left-8 w-10 h-10 text-blue-200/80 opacity-70 -rotate-12" />
            <SparklesIcon className="absolute bottom-16 right-5 w-8 h-8 text-pink-200/80 opacity-70 rotate-6" />
            <div className="absolute bottom-5 left-16 w-8 h-8 bg-yellow-200/50 rounded-full opacity-70"></div>
        </>}
        {variant === 2 && <>
            <AcademicCapIcon className="absolute top-5 right-8 w-10 h-10 text-pink-200/80 opacity-70 rotate-12" />
            <div className="absolute bottom-16 left-5 w-8 h-8 bg-blue-200/50 rounded-full opacity-70"></div>
            <SparklesIcon className="absolute bottom-5 right-16 w-8 h-8 text-yellow-300/80 opacity-70 -rotate-6" />
        </>}
        {variant === 3 && <>
            <div className="absolute top-16 right-5 w-8 h-8 bg-yellow-200/50 rounded-full opacity-70"></div>
            <BookOpenIcon className="absolute bottom-5 left-5 w-10 h-10 text-pink-200/80 opacity-70 -rotate-12" />
            <AcademicCapIcon className="absolute top-5 left-16 w-8 h-8 text-blue-300/80 opacity-70 rotate-6" />
        </>}
        
        <div className="relative z-10">
            <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
                <Icon className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ onJoin, onNavigate }) => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="w-full flex items-center justify-center p-4 sm:p-6 md:p-8 pt-12 md:pt-16">
        <div className="relative w-full max-w-6xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          
          {/* Floating Decorative Elements */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-50 rounded-full opacity-50"></div>
          <div className="absolute -bottom-16 -right-12 w-72 h-72 bg-purple-50 rounded-full opacity-50"></div>

          {/* Sticky Note */}
          <div className="hidden lg:block absolute top-10 left-10 transform -rotate-6 animate-float-1">
              <div className="relative bg-yellow-200 p-4 rounded-lg shadow-lg w-56">
                  <ThumbtackIcon className="absolute -top-3 -right-3 w-8 h-8 text-red-500 transform rotate-45" />
                  <h3 className="font-bold text-sm text-gray-800 mb-1">Don't Forget!</h3>
                  <p className="text-xs text-gray-700">CS Club meeting tonight at 7 PM in Hall C! 🍕</p>
              </div>
          </div>
          
          {/* Reminders Card */}
          <div className="hidden lg:block absolute top-16 right-12 transform rotate-6 animate-float-2">
              <div className="bg-white p-4 rounded-lg shadow-xl border w-60">
                  <h3 className="font-semibold text-gray-800">Reminders</h3>
                  <div className="mt-3 space-y-2">
                      <div className="flex items-center text-sm p-2 bg-blue-50 rounded-md">
                          <ClockIcon className="w-4 h-4 mr-2 text-blue-500" />
                          <div>
                              <p className="font-medium text-gray-700">Today's Meeting</p>
                              <p className="text-xs text-gray-500">1:00 PM - 2:00 PM</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Today's Tasks Card */}
          <div className="hidden lg:block absolute bottom-12 left-16 transform rotate-3 animate-float-3">
              <div className="bg-white p-4 rounded-lg shadow-xl border w-72">
                  <h3 className="font-semibold text-gray-800 mb-2">Today's Tasks</h3>
                  <div className="space-y-3 text-sm">
                      <p className="font-medium text-gray-700">Finish project proposal</p>
                      <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{width: '60%'}}></div></div>
                      <p className="font-medium text-gray-700">Review lecture notes</p>
                      <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-yellow-500 h-2 rounded-full" style={{width: '90%'}}></div></div>
                  </div>
              </div>
          </div>
          
          {/* Student Groups Card */}
          <div className="hidden lg:block absolute bottom-8 right-16 transform -rotate-3 animate-float-4">
              <div className="bg-white p-4 rounded-lg shadow-xl border w-64">
                  <h3 className="font-semibold text-gray-800 mb-2">100+ Student Groups</h3>
                  <div className="flex -space-x-2">
                      <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center border-2 border-white text-red-700"><AcademicCapIcon className="w-6 h-6" /></div>
                      <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center border-2 border-white text-green-700"><BriefcaseIcon className="w-6 h-6" /></div>
                      <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center border-2 border-white text-blue-700"> Arts </div>
                      <div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center border-2 border-white text-yellow-700">Tech</div>
                  </div>
              </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center p-1.5 mb-6 animate-float-5">
                  <div className="grid grid-cols-2 gap-1">
                      <span className="w-5 h-5 bg-indigo-500 rounded-full"></span>
                      <span className="w-5 h-5 bg-gray-700 rounded-full"></span>
                      <span className="w-5 h-5 bg-gray-700 rounded-full"></span>
                      <span className="w-5 h-5 bg-indigo-500 rounded-full"></span>
                  </div>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                  Connect, Learn, and Thrive
              </h1>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-400 tracking-tight mt-1">
                  all in one place.
              </h2>
              
              <p className="mt-6 max-w-xl mx-auto text-lg text-gray-600">
                  Your all-in-one campus platform for news, events, groups, and connections at Rockview University.
              </p>

              <button
                  onClick={onJoin}
                  className="mt-8 bg-indigo-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 flex items-center space-x-2"
              >
                  <span>Get Started Now</span>
                  <ArrowRightIcon className="w-5 h-5"/>
              </button>
          </div>
        </div>
      </div>
      
      {/* News & Entertainment Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">News & Entertainment</h2>
                <p className="text-gray-600 mt-2">Catch up on the latest stories and updates from the campus community.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <NewsCard 
                    onClick={() => onNavigate('blog')}
                    img="https://picsum.photos/seed/ai-article/800/400"
                    category="Academics"
                    title="The Future of AI in Academia"
                />
                <NewsCard 
                    onClick={() => onNavigate('blog')}
                    img="https://picsum.photos/seed/study-article/800/400"
                    category="Student Life"
                    title="A Guide to Effective Study Habits for Finals"
                />
                 <NewsCard 
                    onClick={() => onNavigate('blog')}
                    img="https://picsum.photos/id/145/1200/600"
                    category="Sports"
                    title="Rockview Raptors vs. State Bulldogs: A Season Highlight"
                />
            </div>
            <div className="text-center mt-12">
                <button onClick={() => onNavigate('blog')} className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                    Read more news <span aria-hidden="true">&rarr;</span>
                </button>
            </div>
        </div>
      </section>

      {/* Academic Life Section */}
      <section className="bg-white py-16 sm:py-24">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Academic Life</h2>
                  <p className="text-gray-600 mt-2">Access resources and tools to support your educational journey.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <AcademicCard 
                    onClick={() => onNavigate('classes')}
                    variant={1}
                    icon={BookOpenIcon}
                    title="Library Resources"
                    description="Access millions of digital books, academic journals, and research papers from our extensive online library."
                  />
                   <AcademicCard 
                    onClick={() => onNavigate('classes')}
                    variant={2}
                    icon={MegaphoneIcon}
                    title="Course Catalog"
                    description="Explore courses, check prerequisites, and plan your semester with our interactive course catalog."
                  />
                   <AcademicCard 
                    onClick={() => onNavigate('classes')}
                    variant={3}
                    icon={AcademicCapIcon}
                    title="Research & Grants"
                    description="Discover research opportunities, find faculty-led projects, and apply for academic grants."
                  />
              </div>
          </div>
      </section>
    </div>
  );
};

export default HomePage;
