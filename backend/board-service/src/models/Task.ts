import { DataTypes , Model } from "sequelize";
import { sequelize } from "../config/db";

export class Task extends Model {
    public id! : number;
    public column_id! : number;
    public name! : string;
    public description? : string;
    public position! : number;
}

Task.init({
    id : {type : DataTypes.INTEGER , autoIncrement: true,
        primaryKey : true
    },
    column_id : {type : DataTypes.INTEGER , allowNull : false},
    name : { type : DataTypes.STRING , allowNull : false},
    description : {type : DataTypes.TEXT},
    position : {type : DataTypes.INTEGER , defaultValue : 0}
} , {sequelize , modelName:'Task'})