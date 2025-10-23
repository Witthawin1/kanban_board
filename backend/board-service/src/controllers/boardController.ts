import { Request, Response } from 'express';
import { Board, ColumnModel, Task, BoardMember, TaskAssignee, Tag, TaskTag } from '../models';
import { User } from '../models/User';
import { where } from 'sequelize';

export const getOwnerBoard = async (req: Request, res: Response) => {
  // @ts-ignore
  const owner_id  = req.owner_id; 
  if (!owner_id) {
    return res.status(400).json({ error: 'Owner ID is required.' });
  }

  try {
    const boards = await Board.findAll({
      where: {
        owner_id: owner_id,
      },
      attributes: ['id', 'name', 'createdAt'], 
    });

    if (boards.length === 0) {
      return res.status(200).json({ message: 'No boards found for this owner.', boards: [] });
    }

    res.status(200).json({ boards });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve owner boards.' });
  }
};

export const createBoard = async (req: Request, res: Response) => {
  const { board_name  } = req.body;
  //@ts-ignore
  const owner_id = req.owner_id
  try {
    const board = await Board.create({ name : board_name, owner_id });
    await BoardMember.create({ board_id: board.id, user_id: owner_id, role: 'admin' });
    res.status(201).json({ board_id: board.id, board_name });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: 'Failed to create board' });
  }
};

export const deleteBoard = async (req: Request, res: Response) => {
  const { board_id } = req.params;
  //@ts-ignore
  const owner_id = req.owner_id;
  const board = await Board.findOne({ where: { id: board_id, owner_id: owner_id } });
  if (!board) return res.status(404).json({ error: 'Board not found or unauthorized' });
  await board.destroy();
  res.json({ success: true });
};

export const renameBoard = async (req: Request, res: Response) => {
  const { board_id } = req.params;
  const { board_name } = req.body;
  const user_id = req.body!.owner_id;
  const board = await Board.findOne({ where: { id: board_id, owner_id: user_id } });
  if (!board) return res.status(404).json({ error: 'Board not found or unauthorized' });
  board.name = board_name;
  await board.save();
  res.json({ board_id: board.id, board_name });
};

export const inviteMember = async (req: Request, res: Response) => {
  const { board_id } = req.params;
  const { invited_user_email } = req.body;
  const user_id = req.body!.owner_id;
  const board = await Board.findOne({ where: { id: board_id, owner_id: user_id } });
  if (!board) return res.status(404).json({ error: 'Board not found or unauthorized' });
  try {
    const invited_user= await User.findOne({where : {email : invited_user_email as string}});
    await BoardMember.create({ board_id, user_id: invited_user?.id });
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: 'User not found' });
  }
};

export const retrieveAllColumnsInBoard = async (req: Request, res: Response) => {
    const { board_id } = req.params;
    const user_id = req.body!.owner_id; 

    try {
       
        const board = await Board.findOne({ 
            where: { id: board_id, owner_id: user_id } 
        });

        if (!board) {
            return res.status(404).json({ error: 'Board not found or unauthorized' });
        }

        const columns = await ColumnModel.findAll({
            where: { board_id: board_id },
            order: [['position', 'ASC']], 
            include: [{ 
                model: Task, 
                as: 'Tasks', 
                order: [['position', 'ASC']] 
            }] 
        });

        res.status(200).json(columns);

    } catch (error) {
        console.error('Error retrieving all columns:', error);
        res.status(500).json({ error: 'Internal server error during column retrieval' });
    }
};

export const createColumn = async (req: Request, res: Response) => {
    const { column_name, column_position } = req.body;
    const boardId = req.params.board_id; 

    if (!column_name || typeof column_name !== 'string' || column_name.trim() === '') {
        return res.status(400).json({ error: 'Column name is required and cannot be empty.' });
    }

    try {
        const newColumn = await ColumnModel.create({
            board_id: boardId,
            name: column_name.trim(), 
            position: column_position 
        });

        res.status(201).json(newColumn);
    } catch (error) {

    }
};

export const deleteColumn = async (req: Request, res: Response) => {
  const { column_id } = req.params;
  const {board_id} = req.body
  //@ts-ignore
  const user_id = req!.owner_id;
  const column = await ColumnModel.findOne({
    where: { id: column_id , board_id : board_id},
    include: [{ model: Board, where: { owner_id: user_id } }]
  });
  if (!column) return res.status(404).json({ error: 'Column not found or unauthorized' });
  await column.destroy();
  res.json({ success: true });
};

export const renameColumn = async (req: Request, res: Response) => {
  const { column_id } = req.params;
  const { column_name } = req.body;
  //@ts-ignore
  const user_id = req.owner_id;
  const column = await ColumnModel.findOne({
    where: { id: column_id },
    include: [{ model: Board, where: { owner_id: user_id } }]
  });
  if (!column) return res.status(404).json({ error: 'Column not found or unauthorized' });
  column.name = column_name;
  await column.save();
  res.json({ column_id: column.id, column_name });
};

export const createTask = async (req: Request, res: Response) => {
  const { column_id } = req.params;
  const { task_name, task_description, task_position } = req.body;
  //@ts-ignore
  const user_id = req.owner_id;
  const column = await ColumnModel.findOne({
    where: { id: column_id },
    include: [{ model: Board, where: { owner_id: user_id } }]
  });
  if (!column) return res.status(404).json({ error: 'Column not found or unauthorized' });
  const task = await Task.create({ column_id : column_id, name : task_name, description : task_description, position : task_position });
  res.status(201).json({ task_id: task.id });
};

export const deleteTask = async (req: Request, res: Response) => {
  const { task_id } = req.params;
  //@ts-ignore
  const owner_id = req.owner_id;
  const task = await Task.findOne({
    where: { id: task_id },
    include: [{ model: ColumnModel, include: [{ model: Board, where: { owner_id: owner_id } }] }]
  });
  if (!task) return res.status(404).json({ error: 'Task not found or unauthorized' });
  await task.destroy();
  res.json({ success: true });
};

export const renameTask = async (req: Request, res: Response) => {
  const { task_id } = req.params;
  const { task_name, task_description } = req.body;
  //@ts-ignore
  const owner_id = req.owner_id;
  const task = await Task.findOne({
    where: { id: task_id },
    include: [{ model: ColumnModel, include: [{ model: Board, where: { owner_id: owner_id } }] }]
  });
  if (!task) return res.status(404).json({ error: 'Task not found or unauthorized' });
  task.name = task_name;
  task.description = task_description;
  await task.save();
  res.json({ task_id: task.id, task_name, task_description });
};

export const getColumnTask = async (req: Request, res: Response) => {
    const { column_id } = req.params; 
   
    //@ts-ignore
    const owner_id = req.owner_id; 

    try {
        const column = await ColumnModel.findOne({
            where: { id: column_id },
            include: [{ model: Board, where: { owner_id: owner_id } }]
        });

        if (!column) {
            return res.status(404).json({ error: 'Column not found or unauthorized' });
        }

        const tasks = await Task.findAll({
            where: { column_id: column_id },
            order: [['id', 'ASC']] 
        });
        res.json({ tasks });

    } catch (error) {
        console.error('Error fetching tasks for column:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const assignTask = async (req: Request, res: Response) => {
  const { task_id } = req.params;

  const user_id = req.body!.assign_user_id;
  const task = await Task.findOne({
    where: { id: task_id },
    include: [{ model: ColumnModel, include: [{ model: Board, where: { owner_id: user_id } }] }]
  });
  if (!task) return res.status(404).json({ error: 'Task not found or unauthorized' });
  try {
    const assigned_user_id = user_id;
    await TaskAssignee.create({ task_id, user_id: assigned_user_id });
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: 'User not found' });
  }
};


///////////////////////////////////////////////////////////////////

export const addTag = async (req: Request, res: Response) => {
  const { task_id } = req.params;
  const { name, color } = req.body;
  const user_id = req.body!.id;
  const task = await Task.findOne({
    where: { id: task_id },
    include: [{ model: ColumnModel, include: [{ model: Board, where: { owner_id: user_id } }] }]
  });
  if (!task) return res.status(404).json({ error: 'Task not found or unauthorized' });
  const tag = await Tag.create({ name, color });
  await TaskTag.create({ task_id, tag_id: tag.id });
  res.status(201).json({ tag_id: tag.id });
};

export const getBoard = async (req: Request, res: Response) => {
  const { board_id } = req.params;
  //@ts-ignore
  const owner_id = req.owner_id;
  try {
    const board = await Board.findOne({
      where: { id: board_id },
      include: [
        { model: ColumnModel, include: [Task] },
        { model: BoardMember, where: { user_id : owner_id } }
      ]
    });
    if (!board) return res.status(404).json({ error: 'Board not found or unauthorized' });
    res.json(board);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};