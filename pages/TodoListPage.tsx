import React, { useState, useMemo } from 'react';
import { TodoItem, TodoStatus, User } from '../types';
import { PlusIcon, EllipsisHorizontalIcon, ClockIcon, PaperClipIcon, ChatBubbleOvalLeftEllipsisIcon, PencilSquareIcon } from '../components/icons';

interface TodoListPageProps {
  todos: TodoItem[];
  allUsers: User[];
  onAddTask: (title: string, dueDate?: Date) => void;
  onUpdateTodoStatus: (id: string, status: TodoStatus) => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (todo: TodoItem) => void;
}

const TodoListPage: React.FC<TodoListPageProps> = ({ todos, allUsers, onAddTask, onUpdateTodoStatus, onDeleteTodo, onEditTodo }) => {

    const TaskCard: React.FC<{ todo: TodoItem }> = ({ todo }) => {
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 cursor-grab hover:shadow-md hover:-translate-y-0.5 transform transition-all duration-200 group relative">
                <button onClick={() => onEditTodo(todo)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 p-1 bg-gray-100/50 hover:bg-gray-200 rounded-full z-10">
                    <PencilSquareIcon className="w-4 h-4" />
                </button>
                {todo.tags && todo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {todo.tags.map(tag => (
                            <span key={tag.name} className={`text-xs px-2 py-1 rounded-md font-medium ${tag.color}`}>
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}
                <p className="font-semibold text-gray-800 leading-snug pr-6">{todo.title}</p>
                {todo.dueDate && (
                    <div className="flex items-center text-sm text-gray-500 mt-3">
                        <ClockIcon className="w-4 h-4 mr-1.5 text-gray-400"/>
                        <span>{todo.dueDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</span>
                    </div>
                )}
                <div className="flex justify-between items-end mt-4 pt-3 border-t border-gray-100">
                    <div className="flex -space-x-2">
                        {todo.assignees?.map(user => (
                            <img key={user.id} src={user.avatarUrl} alt={user.name} title={user.name} className="w-7 h-7 rounded-full border-2 border-white object-cover"/>
                        ))}
                    </div>
                    <div className="flex space-x-4 text-sm text-gray-500">
                        {todo.commentsCount != null && <span className="flex items-center"><ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4 mr-1"/>{todo.commentsCount}</span>}
                        {todo.attachmentsCount != null && <span className="flex items-center"><PaperClipIcon className="w-4 h-4 mr-1"/>{todo.attachmentsCount}</span>}
                    </div>
                </div>
            </div>
        );
    };

    const TaskColumn: React.FC<{ title: string; count: number; todos: TodoItem[]; onAddTask?: (title: string, dueDate?: Date) => void }> = ({ title, count, todos, onAddTask }) => {
        const [showAddForm, setShowAddForm] = useState(false);
        const [newTaskTitle, setNewTaskTitle] = useState('');
        const [newDueDate, setNewDueDate] = useState('');

        const handleAdd = (e: React.FormEvent) => {
            e.preventDefault();
            if (newTaskTitle.trim() && onAddTask) {
                let finalDate: Date | undefined = undefined;
                if (newDueDate) {
                    const [year, month, day] = newDueDate.split('-').map(Number);
                    finalDate = new Date(year, month - 1, day);
                }
                onAddTask(newTaskTitle.trim(), finalDate);
                setNewTaskTitle('');
                setNewDueDate('');
                setShowAddForm(false);
            }
        };
        
        return (
            <div className="bg-gray-100/70 rounded-xl p-4 w-full md:w-1/3 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-800">{title}</h3>
                        <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{count}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        {onAddTask && <button onClick={() => setShowAddForm(!showAddForm)} className="text-gray-500 hover:text-gray-800"><PlusIcon className="w-5 h-5"/></button>}
                        <button className="text-gray-500 hover:text-gray-800"><EllipsisHorizontalIcon className="w-5 h-5"/></button>
                    </div>
                </div>
                <div className="overflow-y-auto flex-grow pr-2 -mr-2">
                    {showAddForm && (
                        <form onSubmit={handleAdd} className="mb-4 bg-white p-3 rounded-lg shadow-md border animate-fade-in">
                            <textarea 
                                value={newTaskTitle} 
                                onChange={e => setNewTaskTitle(e.target.value)} 
                                placeholder="Enter task title..." 
                                className="w-full p-2 border rounded-md text-sm mb-2 focus:ring-indigo-500 focus:border-indigo-500" 
                                rows={3}
                                autoFocus
                            />
                            <div className="mt-2">
                                <label className="text-xs font-medium text-gray-600">Due Date (Optional)</label>
                                <input
                                    type="date"
                                    value={newDueDate}
                                    onChange={e => setNewDueDate(e.target.value)}
                                    className="w-full p-2 border rounded-md text-sm mt-1 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-2 mt-3">
                                <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                                <button type="submit" className="px-3 py-1 text-sm bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Add</button>
                            </div>
                        </form>
                    )}
                    {todos.map(todo => <TaskCard key={todo.id} todo={todo} />)}
                </div>
            </div>
        );
    };

    const tasksByStatus = useMemo(() => {
        const grouped: Record<TodoStatus, TodoItem[]> = {
            todo: [],
            inprogress: [],
            done: [],
        };
        todos.forEach(todo => {
            if (grouped[todo.status]) {
                grouped[todo.status].push(todo);
            }
        });
        return grouped;
    }, [todos]);

    return (
        <div className="bg-white min-h-screen p-4 sm:p-8 flex flex-col">
            <header className="mb-6 flex-shrink-0">
                <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
            </header>
            <main className="flex-grow flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                <TaskColumn 
                    title="To do" 
                    count={tasksByStatus.todo.length} 
                    todos={tasksByStatus.todo} 
                    onAddTask={onAddTask} 
                />
                <TaskColumn 
                    title="In progress" 
                    count={tasksByStatus.inprogress.length} 
                    todos={tasksByStatus.inprogress} 
                />
                <TaskColumn 
                    title="Done" 
                    count={tasksByStatus.done.length} 
                    todos={tasksByStatus.done} 
                />
            </main>
        </div>
    );
};

export default TodoListPage;
