import React from 'react';
import { Page, User } from '../types';
import { BriefcaseIcon } from '../components/icons';

interface AboutUsPageProps {
    onNavigate: (page: Page, data?: User) => void;
    currentUser: User;
}

const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate, currentUser }) => {
    return (
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
            <div className="max-w-4xl mx-auto">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900">🐝 About Us – Campus Buzz</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Welcome to Campus Buzz, the heartbeat of Rockview University’s digital community — where information meets interaction, and students stay connected like never before.
                    </p>
                </div>

                <div className="mt-12 prose prose-indigo lg:prose-lg text-gray-700 mx-auto">
                    <p>
                        Campus Buzz is a modern news and social web application designed to keep students informed, engaged, and inspired. It bridges the communication gap across campus by bringing together news, events, discussions, clubs, and marketplaces — all in one accessible platform. Whether you’re looking for the latest university announcements, upcoming events, or a place to buy and sell items, Campus Buzz makes student life simpler and more connected.
                    </p>

                    <p>
                        At its core, Campus Buzz is built to empower students. It promotes collaboration, academic engagement, and social interaction through dynamic features such as:
                    </p>

                    <ul>
                        <li>📰 A newsfeed and notice board that delivers real-time campus updates and official announcements.</li>
                        <li>💬 Forums and discussion boards for exchanging ideas, sharing insights, and fostering intellectual growth.</li>
                        <li>🎉 Events and RSVPs, ensuring you never miss important happenings or gatherings.</li>
                        <li>🛍️ A marketplace where students can buy, sell, or trade essentials securely.</li>
                        <li>🔔 Notifications and personalized feeds that keep every user connected to what matters most.</li>
                        <li>👥 Student clubs and groups, where members can interact, share projects, and promote initiatives.</li>
                    </ul>
                    
                    <p>
                        Campus Buzz isn’t just a web app — it’s a movement toward a smarter, more unified Rockview University, designed to eliminate scattered communication and ensure that every student’s voice is heard.
                    </p>

                    <div className="bg-gray-50 p-6 rounded-lg my-10 border border-gray-200 not-prose">
                        <h2 className="text-2xl font-bold text-gray-800">👨‍💻 About the Developer</h2>
                        <p className="mt-4 text-base text-gray-700">
                            Daniel Chembe Mandalo, the mind behind Campus Buzz, is a passionate IT student and aspiring full-stack developer at Rockview University. With a deep interest in digital innovation, user-centric design, and problem-solving, Daniel created Campus Buzz as part of his academic research project titled
                        </p>
                        <blockquote className="text-base italic border-l-4 border-indigo-300 pl-4 my-4 text-gray-600">
                            “Design and Implementation of a News and Social Web Application for University — A Case of Rockview University.”
                        </blockquote>
                        <p className="text-base text-gray-700">
                            Daniel’s vision is to transform how universities communicate — making information sharing seamless, accessible, and engaging for students and staff alike.
                        </p>
                        <p className="mt-2 text-base text-gray-700">
                            Drawing from both technical expertise and firsthand campus experience, Daniel believes that technology can bridge the gap between education and community. Campus Buzz represents his commitment to building tools that empower students, foster creativity, and promote digital inclusion in higher education.
                        </p>
                         <div className="mt-6 text-center">
                            <button
                                onClick={() => onNavigate('profile', currentUser)}
                                className="inline-flex items-center space-x-2 bg-indigo-600 text-white font-bold py-2 px-6 rounded-full hover:bg-indigo-700 transition-colors shadow-md"
                            >
                                <BriefcaseIcon className="w-5 h-5"/>
                                <span>View My Portfolio</span>
                            </button>
                        </div>
                    </div>

                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">🌍 Our Vision</h2>
                        <p className="mt-2">To create a connected, informed, and empowered student community through digital innovation.</p>

                        <h2 className="text-2xl font-bold text-gray-800 mt-8">💡 Our Mission</h2>
                        <p className="mt-2">To provide a centralized, interactive, and secure platform that enhances communication, collaboration, and engagement within Rockview University.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;
