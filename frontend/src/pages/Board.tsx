import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Route } from "react-router-dom";
import {
    getBoardDetail,
    deleteBoard,
    inviteMemberToBoard,
    createColumnService,
    deleteColumnService,
    renameColumnService,
    retrieveAllColumnsService,
    updateBoard, 
} from "../services/BoardService";
import { getTokenData } from "../services/AuthService";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { Board as BoardType, Column, Task } from "../types";
import { UserTokenData } from "../types/Usertokendata";
import {
    ChevronLeft,
    PlusCircle,
    Loader,
    LayoutDashboard,
    Trash2,
    UserPlus,
    PlusSquare,
    X,
    Edit,
} from "lucide-react";

interface ColumnProps {
    column: Column;
    onCreateTask: (columnId: number) => void;
    onEditTask: (task: Task) => void;
    board: BoardType;
    setBoard: React.Dispatch<React.SetStateAction<BoardType | null>>;
}

const Board: React.FC = () => {
    const { board_id } = useParams<{ board_id: string }>();
    const navigate = useNavigate();

    const [board, setBoard] = useState<BoardType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [tokenData, setTokenData] = useState<UserTokenData | null>(null);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");

    useEffect(() => {
        const fetchTokenData = async () => {
            try {
                const data = await getTokenData();
                setTokenData(data);
            } catch (error) {
                console.error("Failed to fetch token data:", error);
            }
        };
        fetchTokenData();
    }, []);

    const fetchBoardWithColumns = async () => {
        if (!board_id || !tokenData) return;
        setIsLoading(true);
        try {
            const boardData: BoardType = await getBoardDetail(parseInt(board_id));

            const columns = await retrieveAllColumnsService(
                parseInt(board_id),
                tokenData.userId!
            );

            const updatedBoard = { ...boardData, Columns: columns };
            setBoard(updatedBoard);
        } catch (err) {
            console.error("Failed to fetch board:", err);
            alert("Failed to load board data");
            setBoard(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (tokenData) fetchBoardWithColumns();
    }, [tokenData, board_id]);

    const refetchBoard = async () => {
        await fetchBoardWithColumns();
    };

    const handleCreateTask = (columnId: number) => {
        setSelectedColumnId(columnId);
        setEditingTask(undefined);
        setShowTaskForm(true);
    };

    const handleEditTask = (task: Task) => {
        setSelectedColumnId(task.column_id);
        setEditingTask(task);
        setShowTaskForm(true);
    };

    const handleCloseForm = () => {
        setShowTaskForm(false);
        setSelectedColumnId(null);
        setEditingTask(undefined);
        refetchBoard();
    };

    const handleRenameBoard = async () => {
        if (!board || !board_id || !tokenData) return;

        const newName = prompt("Enter new board name:");
        if (!newName?.trim() || newName === board.name) return;

        try {
            await updateBoard(
                parseInt(board_id),
                {
                    board_name: newName.trim(), 
                    owner_id: tokenData.userId! 
                }
            );
            
            setBoard((prev) => (prev ? { ...prev, name: newName.trim() } : null));
            alert(`Board renamed to '${newName.trim()}' successfully!`);
        } catch (err: any) {
            console.error("Rename board failed:", err);
            alert(
                `Failed to rename board: ${
                    err.response?.data?.error || "Unknown error"
                }`
            );
        }
    };

    const handleDeleteBoard = async () => {
        if (
            !board ||
            !board_id ||
            !window.confirm(
                `Are you sure you want to delete the board: ${board.name}? This action cannot be undone.`
            )
        )
            return;

        try {
            if (!tokenData) return;
            await deleteBoard(parseInt(board_id), { owner_id: tokenData.userId! });
            alert(`Board '${board.name}' deleted successfully!`);
            navigate("/dashboard");
        } catch (err: any) {
            console.error("Delete failed:", err);
            alert(
                `Failed to delete board: ${
                    err.response?.data?.error || "Unknown error"
                }`
            );
        }
    };

    const handleInviteMember = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!board_id || !tokenData || !inviteEmail) {
            alert("Missing board ID, authentication data, or email.");
            return;
        }

        try {
            await inviteMemberToBoard(
                parseInt(board_id),
                tokenData.userId!,
                inviteEmail
            );
            alert(`Invitation sent to ${inviteEmail}.`);
            setInviteEmail("");
            setShowInviteModal(false);
        } catch (err: any) {
            console.error("Invite failed:", err);
            alert(
                `Invitation failed: ${
                    err.response?.data?.error || "User not found or unknown error."
                }`
            );
        }
    };

    const handleCreateColumn = async () => {
        if (!board || !board_id || !tokenData) return;
        const newName = prompt("Enter column name:");
        if (!newName?.trim()) return;
        try {
            const position = (board.Columns?.length || 0) + 1;
            await createColumnService(
                parseInt(board_id),
                newName.trim(),
                position,
                tokenData.userId!
            );
            refetchBoard();
        } catch (err: any) {
            console.error("Create column failed:", err);
            alert(
                `Failed to create column: ${
                    err.response?.data?.error || "Unknown error"
                }`
            );
        }
    };

    if (isLoading || !board_id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader className="h-10 w-10 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!board)
        return (
            <div className="text-center py-20 text-red-500 font-semibold">
                Error: Board not found.
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
            <div className="pb-4 border-b border-gray-200 mb-8 flex justify-between items-center">
                <div>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="text-sm text-gray-500 hover:text-indigo-600 flex items-center mb-2"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Dashboard
                    </button>
            
                    <div className="flex items-center">
                        <h1 className="text-4xl font-extrabold text-gray-800 flex items-center">
                            <LayoutDashboard className="h-8 w-8 mr-3 text-indigo-600" />
                            {board.name}
                        </h1>
                        <button
                            onClick={handleRenameBoard}
                            className="ml-4 p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-200 rounded-full transition"
                            title="Rename Board"
                        >
                            <Edit className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={handleCreateColumn}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <PlusSquare className="mr-2 h-4 w-4 inline" /> Add Column
                    </button>
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-orange-600 text-white hover:bg-green-700"
                    >

                        <UserPlus className="mr-2 h-4 w-4 inline" /> Invite
                    </button>
                    <button
                        onClick={handleDeleteBoard}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                        <Trash2 className="mr-2 h-4 w-4 inline" /> Delete
                    </button>
                </div>
            </div>

            <div className="flex space-x-6 overflow-x-auto pb-4 items-start">
                {board.Columns &&
                    board.Columns.map((column) => (
                        <ColumnComponent
                            key={column.id}
                            column={column}
                            onCreateTask={handleCreateTask}
                            onEditTask={handleEditTask}
                            board={board}
                            setBoard={setBoard}
                        />
                    ))}
            </div>

            {showInviteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4 text-indigo-700">
                            Invite Member
                        </h2>
                        <form onSubmit={handleInviteMember}>
                            <input
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                required
                                placeholder="example@user.com"
                                className="w-full p-2 border rounded mb-4"
                            />
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowInviteModal(false)}
                                    className="px-4 py-2 bg-gray-200 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showTaskForm && selectedColumnId && (
                <TaskForm
                    columnId={selectedColumnId}
                    task={editingTask}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
};

const ColumnComponent: React.FC<ColumnProps> = ({
    column,
    onCreateTask,
    onEditTask,
    setBoard,
    board,
}) => {
    const { board_id } = useParams<{ board_id: string }>();
    const ownerId = board.owner_id;

    const handleRenameColumn = async () => {
        const newName = prompt(`Rename column "${column.name}":`);
        if (!newName?.trim() || newName === column.name) return;
        try {
            await renameColumnService(column.id, newName.trim(), ownerId);
            setBoard((prev) => {
                if (!prev) return prev;
                const updated = prev.Columns.map((c) =>
                    c.id === column.id ? { ...c, name: newName.trim() } : c
                );
                return { ...prev, Columns: updated };
            });
        } catch (err: any) {
            console.error("Rename failed:", err);
            alert("Failed to rename column");
        }
    };

    const handleDeleteColumn = async () => {
        if (!window.confirm(`Are you sure you want to delete ${column.name}?`))
            return;
        try {
            await deleteColumnService(column.id, parseInt(board_id!));
            setBoard((prev) => {
                if (!prev) return prev;
                const updated = prev.Columns.filter((c) => c.id !== column.id);
                return { ...prev, Columns: updated };
            });
        } catch (err: any) {
            console.error("Delete failed:", err);
            alert("Failed to delete column");
        }
    };

    return (
        <div className="bg-gray-100 p-4 rounded-xl shadow w-80 flex-shrink-0 min-h-[400px]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-indigo-700 flex items-center">
                    {column.name}
                    <span className="ml-2 bg-gray-200 px-2 rounded-full text-sm">
                        {column.Tasks.length}
                    </span>
                </h2>
                <div className="flex space-x-1">
                    <button
                        onClick={() => onCreateTask(column.id)}
                        className="text-indigo-500 hover:text-indigo-700"
                    >
                        <PlusCircle className="h-5 w-5" />
                    </button>
                    <button
                        onClick={handleRenameColumn}
                        className="text-gray-500 hover:text-indigo-600"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={handleDeleteColumn}
                        className="text-red-500 hover:text-red-700"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {column.Tasks.map((task) => (
                    <div
                        key={task.id}
                        onClick={() => onEditTask(task)}
                        className="cursor-pointer hover:bg-indigo-50 transition rounded-lg"
                    >
                        <TaskCard task={task}/>
                    </div>
                ))}
            </div>

            <button
                onClick={() => onCreateTask(column.id)}
                className="w-full py-2 mt-4 text-indigo-600 font-semibold hover:bg-indigo-100 rounded-lg"
            >
                <PlusCircle className="h-5 w-5 inline mr-2" />
                Add New Task
            </button>
            
        </div>
    );
};

export default Board;