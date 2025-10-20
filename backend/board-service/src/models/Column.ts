import { DataTypes, Model } from "sequelize"; 
import { sequelize } from "../config/db";

export class ColumnModel extends Model {
    public id! : number;
    public board_id! : number;
    public name! : string;
    public position! : number;
}

ColumnModel.init({
    id : {type : DataTypes.INTEGER , autoIncrement : true,
        primaryKey : true
    },
    board_id : { type: DataTypes.INTEGER , allowNull : false},
    name : { type : DataTypes.STRING , allowNull : false},
    position : { type : DataTypes.INTEGER , defaultValue : 0}
} , {sequelize , modelName : 'Column'})