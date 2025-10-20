import { DataTypes , Model } from "sequelize";
import { sequelize } from "../config/db";

export class TaskTag extends Model {
    public task_id! : number;
    public tag_id! : number;
}

TaskTag.init({
    task_id : {type : DataTypes.INTEGER , primaryKey : true},
    tag_id : { type : DataTypes.INTEGER , primaryKey : true}
} , {sequelize , modelName : 'TaskTag'})