import React, { useState, useEffect } from 'react';
import { TodoItem } from '../types';
import { SpinnerIcon } from './icons';

interface TodoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: { title: string; dueDate?: Date }) => Promise<void>;
  todo: TodoItem | null;
}

const TodoEditModal: React.FC<TodoEditModalProps> = ({ isOpen, onClose, onSave, todo }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const toISODateString = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDueDate(todo.dueDate ? toISODateString(todo.dueDate) : '');
    }
  }, [todo, isOpen]);

  if (!isOpen || !todo) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    let finalDate: Date | undefined = undefined;
    if (dueDate) {
        const [year, month, day] = dueDate.split('-').map(Number);
        finalDate = new Date(year, month - 1, day);
    }
    await onSave(todo.id, { title, dueDate: finalDate });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Edit Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="todo-title" className="block text-sm font-medium text-gray-700">Task Title</label>
              <textarea id="todo-title" value={title} onChange={e => setTitle(e.target.value)} required rows={4}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="todo-dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
              <input type="date" id="todo-dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>
          <div className="p-4 border-t flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={isSaving} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 w-24 flex justify-center items-center disabled:bg-indigo-300">
              {isSaving ? <SpinnerIcon /> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoEditModal;
