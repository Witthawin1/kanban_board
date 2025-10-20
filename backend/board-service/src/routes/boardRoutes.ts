import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import {
  getOwnerBoard , createBoard, deleteBoard, renameBoard, inviteMember,
  createColumn, deleteColumn, renameColumn,
  createTask, deleteTask, renameTask, assignTask, addTag, getBoard,
  retrieveAllColumnsInBoard,
  getColumnTask
} from '../controllers/boardController';

const router = Router();
router.use(authMiddleware);
router.get('/boards' , getOwnerBoard)
router.get('/boards/:owner_id' , getOwnerBoard)
router.post('/boards', createBoard);
router.patch('/boards/:board_id', renameBoard);
router.delete('/boards/:board_id', deleteBoard);

router.post('/boards/:board_id/invite', inviteMember);

router.post('/boards/:board_id/columns', createColumn);
router.delete('/columns/:column_id', deleteColumn);
router.patch('/columns/:column_id', renameColumn);

router.post('/boards/:board_id/columns/all', retrieveAllColumnsInBoard);

router.post('/columns/:column_id/tasks', createTask);
router.delete('/tasks/:task_id', deleteTask);
router.patch('/tasks/:task_id', renameTask);

router.post('/columns/:column_id/tasks/all', getColumnTask);

router.post('/tasks/:task_id/assign', assignTask);

router.post('/tasks/:task_id/tags', addTag);
router.get('/boards/:board_id', getBoard);

export default router;