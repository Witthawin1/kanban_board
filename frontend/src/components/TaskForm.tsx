import React, { useState } from 'react';
import { createTask, updateTask } from '../services/BoardService';
import { Task } from '../types';
import { X, Edit3, PlusCircle, Loader, Info } from 'lucide-react';

interface Props {
  columnId: number;
  task?: Task;
  onClose: () => void;
}

const TaskForm: React.FC<Props> = ({ columnId, task, onClose }) => {
  const isEditMode = !!task;
  const [name, setName] = useState(task?.name || '');
  const [description, setDescription] = useState(task?.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Task name is required.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await updateTask(task.id, { name, description });
      } else {
        const newTaskData = { name, column_id: columnId, description: description || undefined };
        await createTask(newTaskData);
      }
      onClose(); 
    } catch (err) {
      console.error(err);
      setError(isEditMode ? 'Failed to update task. Please try again.' : 'Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 opacity-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition duration-150"
          aria-label="Close form"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center mb-6 border-b pb-3">
          {isEditMode 
            ? <Edit3 className="h-6 w-6 mr-3 text-indigo-600" /> 
            : <PlusCircle className="h-6 w-6 mr-3 text-indigo-600" />}
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Edit Task' : 'Create New Task'}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm flex items-start">
            <Info className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="task-name" className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
            <input
              id="task-name"
              type="text"
              placeholder="e.g., Implement dark mode feature"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 placeholder-gray-400 text-gray-800"
            />
          </div>

          <div>
            <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              id="task-description"
              placeholder="Detail the requirements and goals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 placeholder-gray-400 text-gray-800 resize-none"
            />
          </div>

          <div className="flex space-x-3 pt-2">
            
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className={`flex-1 py-3 rounded-lg text-white font-semibold shadow-md transition duration-200 ease-in-out transform hover:scale-[1.005] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 inline-flex justify-center items-center
                ${(isSubmitting || !name.trim())
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-400/50'
                }`}
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  {isEditMode ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                <>{isEditMode ? 'Update Task' : 'Create Task'}</>
              )}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;