import React, { useState } from 'react';
import { SpinnerIcon } from './icons';

interface BecomeMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (applicationData: { expertise: string; reason: string; experience: string }) => Promise<void>;
}

const BecomeMentorModal: React.FC<BecomeMentorModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    expertise: '',
    reason: '',
    experience: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
    // Parent component handles closing the modal.
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Become a Mentor</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">Area of Expertise</label>
              <input type="text" id="expertise" value={formData.expertise} onChange={e => setFormData({...formData, expertise: e.target.value})} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="e.g., Software Engineering, Biology Research" />
            </div>
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Why do you want to be a mentor?</label>
              <textarea id="reason" rows={4} value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
            </div>
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Relevant Experience</label>
              <textarea id="experience" rows={4} value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="e.g., Previous mentorship roles, projects, internships..."></textarea>
            </div>
          </div>
          <div className="p-4 border-t flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 w-40 flex justify-center items-center disabled:bg-indigo-300">
              {isSubmitting ? <SpinnerIcon /> : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeMentorModal;