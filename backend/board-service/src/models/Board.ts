import { DataTypes , Model } from "sequelize";
import { sequelize } from "../config/db";

export class Board extends Model {
    public id! : number;
    public name! : string;
    public owner_id! : number
}

Board.init({
    id : {type : DataTypes.INTEGER , autoIncrement : true,
    primaryKey : true    
    },
    name : { type : DataTypes.STRING , allowNull : false},
    owner_id : { type : DataTypes.INTEGER , allowNull : false}
} , { sequelize , modelName: 'Board'})