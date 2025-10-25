import React, { useState, useEffect } from 'react';
import { ScheduleItem } from '../types';
import { SpinnerIcon, TrashIcon } from './icons';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<ScheduleItem, 'id'>, id?: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  itemToEdit: ScheduleItem | null;
}

const DAYS: ScheduleItem['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const COLORS = [
    'bg-blue-200 border-blue-400 text-blue-800',
    'bg-green-200 border-green-400 text-green-800',
    'bg-yellow-200 border-yellow-400 text-yellow-800',
    'bg-purple-200 border-purple-400 text-purple-800',
    'bg-pink-200 border-pink-400 text-pink-800',
    'bg-orange-200 border-orange-400 text-orange-800',
];

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, onSave, onDelete, itemToEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    day: 'Monday' as ScheduleItem['day'],
    startTime: '09:00',
    endTime: '10:00',
    venue: '',
    color: COLORS[0],
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        title: itemToEdit.title,
        day: itemToEdit.day,
        startTime: itemToEdit.startTime,
        endTime: itemToEdit.endTime,
        venue: itemToEdit.venue,
        color: itemToEdit.color,
      });
    } else {
      // Reset to default for new item
      setFormData({
        title: '',
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        venue: '',
        color: COLORS[0],
      });
    }
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    if (formData.startTime >= formData.endTime) {
      alert('End time must be after start time.');
      return;
    }
    setIsSaving(true);
    await onSave(formData, itemToEdit?.id);
    setIsSaving(false);
  };
  
  const handleDelete = async () => {
    if (onDelete && itemToEdit && window.confirm('Are you sure you want to delete this class?')) {
        await onDelete(itemToEdit.id);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{itemToEdit ? 'Edit Class' : 'Add New Class'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Class Name</label>
              <input type="text" id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="day" className="block text-sm font-medium text-gray-700">Day of the Week</label>
                    <select id="day" value={formData.day} onChange={e => setFormData({...formData, day: e.target.value as ScheduleItem['day']})} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="venue" className="block text-sm font-medium text-gray-700">Venue / Location</label>
                    <input type="text" id="venue" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input type="time" id="startTime" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                    <input type="time" id="endTime" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} required min={formData.startTime} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <div className="mt-2 flex flex-wrap gap-2">
                    {COLORS.map(color => (
                        <button type="button" key={color} onClick={() => setFormData({...formData, color})} className={`w-8 h-8 rounded-full ${color.split(' ')[0]} border-2 ${formData.color === color ? 'ring-2 ring-offset-2 ring-indigo-500' : 'border-transparent'}`}></button>
                    ))}
                </div>
            </div>
          </div>
          <div className="p-4 border-t flex justify-between items-center">
            <div>
                {itemToEdit && onDelete && (
                    <button type="button" onClick={handleDelete} className="text-red-600 p-2 rounded-full hover:bg-red-50">
                        <TrashIcon className="w-6 h-6"/>
                    </button>
                )}
            </div>
            <div className="flex space-x-2">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={isSaving} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 w-24 flex justify-center items-center disabled:bg-indigo-300">
                    {isSaving ? <SpinnerIcon /> : 'Save'}
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;