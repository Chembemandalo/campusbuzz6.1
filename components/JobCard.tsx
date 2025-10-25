import React from 'react';
import { Job } from '../types';
import { BriefcaseIcon, MapPinIcon } from './icons';

interface JobCardProps {
    job: Job;
    isExpanded: boolean;
    onToggleExpand: (jobId: string) => void;
    onApplyClick: (job: Job) => void;
}

const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

const JobCard: React.FC<JobCardProps> = ({ job, isExpanded, onToggleExpand, onApplyClick }) => {
    const isInternship = job.type === 'Internship';

    return (
        <div 
            className="bg-white rounded-lg shadow-md p-6 flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            onClick={() => onToggleExpand(job.id)}
        >
            <div className="flex justify-between items-start">
                <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${isInternship ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {job.type}
                </span>
                <span className="text-xs text-gray-500">{timeAgo(job.postedDate)}</span>
            </div>
            <div className="flex-grow my-4">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors mb-2">{job.title}</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-700">
                        <BriefcaseIcon className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="font-medium">{job.company}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <MapPinIcon className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span>{job.location}</span>
                    </div>
                </div>
            </div>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-screen' : 'max-h-0'}`}>
                 <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Job Description</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{job.description}</p>
                 </div>
            </div>

            <div className="mt-4">
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card from toggling when clicking the button
                        onApplyClick(job);
                    }}
                    className="w-full block text-center bg-indigo-50 text-indigo-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-indigo-100 transition-colors"
                >
                    Apply Now
                </button>
            </div>
        </div>
    );
};

export default JobCard;