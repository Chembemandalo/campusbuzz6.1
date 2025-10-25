import React, { useState } from 'react';
import { Job } from '../types';
import { SpinnerIcon } from './icons';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateJob: (jobData: Omit<Job, 'id' | 'postedDate' | 'applyLink'>) => Promise<void>;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose, onCreateJob }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    type: 'Job' as 'Job' | 'Internship',
  });
  const [isCreating, setIsCreating] = useState(false);
  
  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      description: '',
      type: 'Job',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) return;

    setIsCreating(true);
    await onCreateJob(formData);
    setIsCreating(false);
    resetForm();
    // Parent component will close the modal.
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">List a New Opportunity</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="job-title" className="block text-sm font-medium text-gray-700">Job Title</label>
                        <input type="text" id="job-title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="job-company" className="block text-sm font-medium text-gray-700">Company</label>
                        <input type="text" id="job-company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="job-location" className="block text-sm font-medium text-gray-700">Location</label>
                        <input type="text" id="job-location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="job-type" className="block text-sm font-medium text-gray-700">Type</label>
                        <select id="job-type" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as 'Job' | 'Internship'})} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            <option>Job</option>
                            <option>Internship</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="job-description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="job-description" rows={6} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Provide details about the role, responsibilities, and qualifications..."></textarea>
                </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={isCreating} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 w-32 flex justify-center items-center disabled:bg-indigo-300">
                    {isCreating ? <SpinnerIcon /> : 'List Job'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobModal;
