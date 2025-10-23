import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBoards } from '../services/BoardService';
import { Board } from '../types';
import { LayoutDashboard, PlusCircle, Loader, XCircle } from 'lucide-react';
import { getTokenData } from '../services/AuthService';

const Dashboard: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const tokenData = await getTokenData(); 
        const data = await getBoards();
        setBoards(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load your boards. Please try again.');
        setBoards([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBoards();
  }, []);


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Loader className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="mt-4 text-lg">Loading your boards...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-red-600 bg-red-50 border border-red-200 rounded-lg">
          <XCircle className="h-8 w-8" />
          <p className="mt-4 text-lg font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-sm text-red-700 hover:underline"
          >
            Click to Retry
          </button>
        </div>
      );
    }

    if (boards.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
          <LayoutDashboard className="h-12 w-12 text-indigo-400" />
          <h3 className="mt-4 text-xl font-semibold text-gray-700">No Boards Found</h3>
          <p className="mt-2 text-gray-500">Looks like you haven't created any boards yet.</p>
          <button
            onClick={() => navigate('/board/new')}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Start by Creating One
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {boards.map((board) => (
          <div
            key={board.id}
            onClick={() => navigate(`/board/${board.id}`)}
            className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
          >
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition duration-150 truncate">
              {board.name}
            </h2>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              ID: {board.id} | Owner: {board.owner_id}
            </p>
            <div className="mt-4 text-xs font-medium text-gray-400">
              Click to open
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="flex justify-between items-center pb-6 border-b border-gray-200 mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 flex items-center">
          <LayoutDashboard className="h-8 w-8 mr-3 text-indigo-600" />
          Dashboard
        </h1>
        <button
          onClick={() => navigate('/board/new')}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 transform hover:scale-[1.02]"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          New Board
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default Dashboard;