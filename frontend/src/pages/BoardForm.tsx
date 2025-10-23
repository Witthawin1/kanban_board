import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBoardDetail, createBoard, updateBoard } from '../services/BoardService';
import { getTokenData } from '../services/AuthService';
import { UserTokenData } from '../types/Usertokendata'; 
import {Board as BoardType} from '../types/index'
import { PlusCircle, Edit3, Loader, XCircle, ChevronLeft } from 'lucide-react'; 

const BoardForm: React.FC = () => {
    const { board_id } = useParams<{ board_id: string }>();
    const isEditMode = !!board_id;
    
    const [name, setName] = useState('');
    const [tokenData, setTokenData] = useState<UserTokenData | null>(null); 
    const [isLoading, setIsLoading] = useState(true); 
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();


    useEffect(() => {
        const loadData = async () => {
            setError(null);
            let boardData: BoardType | null = null;

            try {
                const data = await getTokenData(); 
                setTokenData(data);

                if (isEditMode && board_id) {
                    const response = await getBoardDetail(parseInt(board_id));
                    
                    if (response && response.boards && Array.isArray(response.boards)) {
                        boardData = response.boards.find((b: BoardType) => b.id === parseInt(board_id));
                    } else if (response && response.id) {
                        boardData = response;
                    }

                    if (boardData) {
                        setName(boardData.name);
                    } else {
                        setError('Board not found or unauthorized.');
                    }
                }
            } catch (err) {
                console.error(err);
                setError('Failed to initialize form data. Please check your connection or login status.');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [board_id, isEditMode]); 


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Board name cannot be empty.');
            return;
        }
        setError(null);
        setIsSubmitting(true);

        try {
            if (isEditMode && board_id) {
                await updateBoard(parseInt(board_id), { owner_id : tokenData?.userId || 0 , board_name : name });
            } else if (tokenData && tokenData.userId) {
                await createBoard({ owner_id : tokenData.userId, board_name : name });
            } else {
                setError("Cannot proceed: Missing user authentication data.");
                setIsSubmitting(false);
                return;
            }
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(isEditMode ? 'Failed to update board. Server error.' : 'Failed to create board. Server error.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center p-10">
                    <Loader className="h-10 w-10 animate-spin text-indigo-500" />
                    <p className="mt-4 text-xl text-gray-600">Loading form...</p>
                </div>
            </div>
        );
    }

    if (!tokenData && !isEditMode) { 
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-sm text-center border border-red-200">
                    <XCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-red-700">Authentication Required</h3>
                    <p className="text-gray-500 mt-2">Cannot create a board without valid user data.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-6 text-indigo-600 hover:text-indigo-700 font-medium flex items-center mx-auto"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 transition-all duration-300">
                
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center text-gray-800">
                        {isEditMode 
                            ? <Edit3 className="h-8 w-8 mr-3 text-indigo-600" /> 
                            : <PlusCircle className="h-8 w-8 mr-3 text-indigo-600" />}
                        <h2 className="text-3xl font-bold">
                            {isEditMode ? 'Edit Board' : 'Create New Board'}
                        </h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        {isEditMode ? `Updating Board ID: ${board_id}` : 'Provide a name for your new board.'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm flex items-center">
                        <XCircle className="h-4 w-4 mr-2" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter Board Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder-gray-500 text-gray-800 text-lg"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading || !name.trim()} // เพิ่ม !name.trim() เพื่อปิดใช้งานถ้าชื่อว่าง
                        className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition duration-200 ease-in-out transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 inline-flex justify-center items-center
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
                            <>
                                {isEditMode ? <Edit3 className="h-5 w-5 mr-2" /> : <PlusCircle className="h-5 w-5 mr-2" />}
                                {isEditMode ? 'Update Board' : 'Create Board'}
                            </>
                        )}
                    </button>
                </form>
                
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-6 w-full text-center text-sm text-gray-500 hover:text-indigo-600 transition duration-150 flex items-center justify-center"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default BoardForm;