import React, { useState } from 'react';
import { SpinnerIcon, PlusIcon, TrashIcon } from './icons';

interface CreatePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePoll: (question: string, options: string[]) => Promise<void>;
}

const CreatePollModal: React.FC<CreatePollModalProps> = ({ isOpen, onClose, onCreatePoll }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isCreating, setIsCreating] = useState(false);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = options.map(o => o.trim()).filter(o => o !== '');
    if (isCreating || !question.trim() || validOptions.length < 2) return;
    
    setIsCreating(true);
    await onCreatePoll(question.trim(), validOptions);
    setIsCreating(false);
    onClose();
    // Reset form
    setQuestion('');
    setOptions(['', '']);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Create a New Poll</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="poll-question" className="block text-sm font-medium text-gray-700 mb-1">Poll Question</label>
              <input type="text" id="poll-question" value={question} onChange={e => setQuestion(e.target.value)} required placeholder="What do you want to ask?"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input type="text" value={option} onChange={e => handleOptionChange(index, e.target.value)} required placeholder={`Option ${index + 1}`}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <button type="button" onClick={() => removeOption(index)} disabled={options.length <= 2}
                      className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addOption} className="mt-2 flex items-center space-x-2 text-sm text-indigo-600 font-semibold hover:underline">
                <PlusIcon className="w-4 h-4" />
                <span>Add Option</span>
              </button>
            </div>
          </div>
          <div className="p-4 border-t flex justify-end">
            <button type="submit" disabled={isCreating} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 w-28 flex justify-center items-center disabled:bg-indigo-300">
              {isCreating ? <SpinnerIcon /> : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePollModal;
