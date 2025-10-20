import { Board } from './Board';
import { ColumnModel } from './Column';
import { Task } from './Task';
import { BoardMember } from './BoardMember';
import { TaskAssignee } from './TaskAssignee';
import { Tag } from './Tag';
import { TaskTag } from './TaskTag';
import { User } from './User';

Board.hasMany(ColumnModel, { foreignKey: 'board_id' });
ColumnModel.belongsTo(Board, { foreignKey: 'board_id' });
ColumnModel.hasMany(Task, { foreignKey: 'column_id' });
Task.belongsTo(ColumnModel, { foreignKey: 'column_id' });
Board.hasMany(BoardMember, { foreignKey: 'board_id' });
BoardMember.belongsTo(Board, { foreignKey: 'board_id' });
BoardMember.belongsTo(User, { foreignKey: 'user_id' });
Task.hasMany(TaskAssignee, { foreignKey: 'task_id' });
TaskAssignee.belongsTo(Task, { foreignKey: 'task_id' });
TaskAssignee.belongsTo(User, { foreignKey: 'user_id' });
Task.hasMany(TaskTag, { foreignKey: 'task_id' });
TaskTag.belongsTo(Task, { foreignKey: 'task_id' });
TaskTag.belongsTo(Tag, { foreignKey: 'tag_id' });

export { Board, ColumnModel, Task, BoardMember, TaskAssignee, Tag, TaskTag };