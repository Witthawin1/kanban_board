import { DataTypes , Model } from "sequelize";
import {sequelize} from '../config/db'

export class TaskAssignee extends Model {
    public task_id! : number;
    public user_id! : number;
}

TaskAssignee.init({
    task_id : {type : DataTypes.INTEGER , primaryKey : true},
    user_id : { type: DataTypes.INTEGER , primaryKey : true}
} , { sequelize , modelName:'TaskAssignee'})