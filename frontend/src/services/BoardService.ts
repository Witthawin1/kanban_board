import axios from 'axios';
import { Board, Task, Column } from '../types'; // Ensure Column and Task types are imported

const API_BASE_URL = 'http://localhost:3002';


const getToken = () => localStorage.getItem('token');
const getHeaders = (data?: any) => ({
    Authorization: `Bearer ${getToken()}`,
    ...(data && { 'Content-Type': 'application/json' })
});

export const createTask = async (
    columnId: number,
    task: { task_name: string; task_description?: string; task_position: number; owner_id: number }
): Promise<{ task_id: number }> => {
    const data = task;
    const response = await axios.post(
        `${API_BASE_URL}/columns/${columnId}/tasks`,
        data,
        { headers: getHeaders(data) }
    );
    return response.data;
};

export const updateTask = async (
    taskId: number,
    task: { task_name: string; task_description?: string; owner_id: number }
): Promise<any> => {
    const data = task;
    const response = await axios.patch(
        `${API_BASE_URL}/tasks/${taskId}`,
        data,
        { headers: getHeaders(data) }
    );
    return response.data;
};

export const deleteTaskService = async ( 
    taskId: number,
    userId: number
): Promise<void> => {
    
    const data = { id: userId }; 

    await axios.delete(
        `${API_BASE_URL}/tasks/${taskId}`,
        {
            headers: getHeaders(data),
            data: data
        }
    );
};


export const getTasksForColumnService = async ( // NEW SERVICE
    columnId: number,
    ownerId: number
): Promise<Task[]> => {
    
    const data = { owner_id: ownerId };

    const response = await axios.post(
        `${API_BASE_URL}/columns/${columnId}/tasks/all`,
        data,
        { headers: getHeaders(data) }
    );
    return response.data.tasks;
};


export const moveTask = async (taskId: number, newColumnId: number, newPosition: number): Promise<void> => {
    const data = {
        new_column_id: newColumnId,
        new_position: newPosition
    };
    await axios.patch(`${API_BASE_URL}/tasks/${taskId}/move`, data, {
        headers: getHeaders(data)
    });
};

export const getBoards = async (): Promise<Board[]> => {
    const response = await axios.get(
        `${API_BASE_URL}/boards`,
        { headers: getHeaders() }
    );
    return response.data.boards;
};

export const getBoardDetail = async (boardId: number): Promise<Board> => {
    const response = await axios.get(`${API_BASE_URL}/boards/${boardId}`, {
        headers: getHeaders()
    });
    return response.data;
};

export const createBoard = async (board: { owner_id : number ,board_name: string }): Promise<void> => {
    const data = board;
    await axios.post(`${API_BASE_URL}/boards`, data, {
        headers: getHeaders(data)
    });
};

export const updateBoard = async (boardId: number, data: { owner_id: number , board_name : string }): Promise<void> => {
    await axios.patch(`${API_BASE_URL}/boards/${boardId}`, data, {
        headers: getHeaders(data)
    });
};

export const deleteBoard = async (boardId: number, data: { owner_id: number }): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/boards/${boardId}`, {
        headers: getHeaders(data),
        data: data
    });
};

export const inviteMemberToBoard = async (
    boardId: number,
    ownerId: number,
    invitedUserEmail: string
): Promise<{ success: boolean }> => {
    const data = {
        invited_user_email: invitedUserEmail,
        owner_id: ownerId,
    };
   
    const response = await axios.post(
        `${API_BASE_URL}/boards/${boardId}/invite`,
        data,
        { headers: getHeaders(data) }
    );
    return response.data;
};

export const createColumnService = async (
    boardId: number,
    columnName: string,
    columnPosition: number,
    ownerId: number
): Promise<{ column_id: number }> => {
   
    const data = {
        column_name: columnName,
        column_position: columnPosition,
        owner_id: ownerId
    };
   
    const response = await axios.post(
        `${API_BASE_URL}/boards/${boardId}/columns`,
        data,
        { headers: getHeaders(data) }
    );
    return response.data;
};

export const deleteColumnService = async (
    columnId: number,
    boardId : number
): Promise<{ success: boolean }> => {
   
    const data = { board_id: boardId };
   
    const response = await axios.delete(
        `${API_BASE_URL}/columns/${columnId}`,
        {
            headers: getHeaders(data),
            data: data
        }
    );
    return response.data;
};

export const renameColumnService = async (
    columnId: number,
    columnName: string,
    ownerId: number
): Promise<void> => {
   
    const data = {
        column_name: columnName,
        owner_id: ownerId
    };
   
    await axios.patch(
        `${API_BASE_URL}/columns/${columnId}`,
        data,
        { headers: getHeaders(data) }
    );
};

export const retrieveAllColumnsService = async (
    boardId: number,
    ownerId: number
): Promise<Column[]> => {
   
    const data = { owner_id: ownerId };

    const response = await axios.post(
        `${API_BASE_URL}/boards/${boardId}/columns/all`,
        data,
        { headers: getHeaders(data) }
    );
    return response.data;
};