import React, { useState, useMemo } from 'react';
import { Job, User } from '../types';
import JobCard from '../components/JobCard';
import { BriefcaseIcon } from '../components/icons';
import JobApplicationModal from '../components/JobApplicationModal';

interface JobsPageProps {
  jobs: Job[];
  currentUser: User;
}

type JobFilter = 'All' | 'Job' | 'Internship';
type SortKey = 'newest' | 'oldest';

const JobsPage: React.FC<JobsPageProps> = ({ jobs, currentUser }) => {
    const [activeFilter, setActiveFilter] = useState<JobFilter>('All');
    const [sortKey, setSortKey] = useState<SortKey>('newest');
    const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
    const [applyingForJob, setApplyingForJob] = useState<Job | null>(null);

    const filteredAndSortedJobs = useMemo(() => {
        return jobs
            .filter(job => {
                const filterMatch = activeFilter === 'All' || job.type === activeFilter;
                return filterMatch;
            })
            .sort((a, b) => {
                if (sortKey === 'newest') {
                    return b.postedDate.getTime() - a.postedDate.getTime();
                }
                return a.postedDate.getTime() - b.postedDate.getTime();
            });
    }, [jobs, activeFilter, sortKey]);
    
    const handleToggleExpand = (jobId: string) => {
        setExpandedJobId(prevId => (prevId === jobId ? null : jobId));
    };

    const handleOpenApplyModal = (job: Job) => {
        setApplyingForJob(job);
    };

    const handleApplicationSubmit = async (applicationData: any) => {
        console.log('Submitting application:', applicationData);
        // In a real app, this would send data to a backend.
        alert(`Your application for "${applicationData.jobTitle}" has been submitted!`);
        setApplyingForJob(null);
    };

    const FilterButton: React.FC<{label: JobFilter | 'Most Recent'}> = ({ label }) => {
        let isActive = false;
        let onClick = () => {};

        if (label === 'Most Recent') {
            isActive = sortKey === 'newest';
            onClick = () => setSortKey('newest');
        } else {
            isActive = activeFilter === label;
            onClick = () => setActiveFilter(label as JobFilter);
        }
        
        return (
            <button
                onClick={onClick}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
                {label}
            </button>
        );
    };

    return (
        <>
            <div className="bg-gray-100 min-h-screen pt-8 animate-fade-in-up">
                <div className="container mx-auto px-4">
                    {/* Banner */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-8 md:p-12 flex justify-center items-center relative overflow-hidden text-center shadow-lg">
                        <div className="absolute -left-16 -bottom-16 text-white/10">
                            <BriefcaseIcon className="w-48 h-48 transform -rotate-12" />
                        </div>
                        <div className="z-10">
                            <h1 className="text-3xl md:text-4xl font-bold">Discover Opportunities</h1>
                            <p className="text-sm md:text-base text-indigo-200 mt-2 max-w-lg mx-auto">Find the perfect jobs and internships for your career growth.</p>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {/* Filter Bar */}
                    <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex justify-center items-center gap-4">
                        <div className="flex items-center gap-2 flex-wrap justify-center">
                            <FilterButton label="All" />
                            <FilterButton label="Job" />
                            <FilterButton label="Internship" />
                            <FilterButton label="Most Recent" />
                        </div>
                    </div>

                    {filteredAndSortedJobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredAndSortedJobs.map(job => (
                                <JobCard 
                                    key={job.id} 
                                    job={job}
                                    isExpanded={job.id === expandedJobId}
                                    onToggleExpand={handleToggleExpand}
                                    onApplyClick={handleOpenApplyModal}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
                            <p className="font-semibold text-lg">No Opportunities Found</p>
                            <p className="text-sm mt-1">Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            </div>
            <JobApplicationModal 
                isOpen={!!applyingForJob}
                onClose={() => setApplyingForJob(null)}
                job={applyingForJob}
                currentUser={currentUser}
                onSubmit={handleApplicationSubmit}
            />
        </>
    );
};

export default JobsPage;