export interface Board {
  boards: Board;
  userId : number;
  id: number;
  name: string;
  owner_id: number;
  Columns: Column[];
}

export interface Column {
  id: number;
  board_id: number;
  name: string;
  position: number;
  Tasks: Task[];
}

export interface Task {
  id: number;
  column_id: number;
  userId: number;
  name: string;
  description?: string;
  position: number;
}

export interface Notification {
  id: number;
  user_id: number;
  message: string;
  type: string;
  read_status: boolean;
}