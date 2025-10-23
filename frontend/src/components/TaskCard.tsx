import React from 'react';
import { Task } from '../types';
import { Hash, X } from 'lucide-react'; 

import { deleteTaskService } from '../services/BoardService'; 

interface Props {
  task: Task;
}

const TaskCard: React.FC<Props> = ({ task }) => {
  
  const [isDeleting, setIsDeleting] = React.useState(false);
  const priorityColorClass = 'border-indigo-500'; 

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    if (window.confirm(`Are you sure you want to delete task: "${task.name}"?`)) {
      
      setIsDeleting(true);
      
      try {
        await deleteTaskService(task.id);
        
      } catch (error) {
        console.error("Failed to delete task:", error);
        alert('Failed to delete task. Please try again.');
        
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div 
      className={`
        bg-white p-4 rounded-xl shadow-lg border-l-4 transition-all duration-200 cursor-pointer 
        hover:shadow-xl hover:ring-2 hover:ring-indigo-100 transform hover:scale-[1.005] 
        ${priorityColorClass}
        // เพิ่มสไตล์เมื่อกำลังลบ เพื่อแสดงสถานะ
        ${isDeleting ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <div className="relative"> 
        
        <button 
          className="absolute top-0 right-0 p-1 text-gray-400 hover:text-red-500 rounded-full transition-colors duration-150 z-10"
          onClick={handleDeleteClick}
          aria-label="Delete Task"
          disabled={isDeleting} 
        >
          {isDeleting ? (
             <svg className="animate-spin h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : (
            <X className="h-4 w-4" />
          )}
        </button>

        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 pr-6"> 
          {task.name}
        </h3>
      </div>
      
      {task.description && (
        <p className="text-sm text-gray-600 mt-1 line-clamp-3">
          {task.description}
        </p>
      )}
      
      <div className="mt-3 pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs">
        
        <span className="inline-flex items-center bg-gray-50 text-gray-700 font-medium px-2 py-1 rounded-full text-xs border border-gray-200">
          <Hash className="h-3 w-3 mr-1" />
          Task ID: {task.id}
        </span>
        
      </div>
    </div>
  );
};

export default TaskCard;