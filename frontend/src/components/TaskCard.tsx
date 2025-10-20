import React from 'react';
import { Task } from '../types';
import { Hash } from 'lucide-react'; 

interface Props {
  task: Task;
}

const TaskCard: React.FC<Props> = ({ task }) => {
 
  const priorityColorClass = 'border-indigo-500'; 

  return (
    <div className={`
      bg-white p-4 rounded-xl shadow-lg border-l-4 transition-all duration-200 cursor-pointer 
      hover:shadow-xl hover:ring-2 hover:ring-indigo-100 transform hover:scale-[1.005] 
      ${priorityColorClass}
    `}>
      <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
        {task.name}
      </h3>
      
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