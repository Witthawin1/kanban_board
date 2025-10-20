import { DataTypes , Model } from "sequelize";
import { sequelize } from "../config/db"; 

export class Tag extends Model {
    public id! : number;
    public name! : string;
    public color! : string
}

Tag.init({
    id : {type : DataTypes.INTEGER , autoIncrement : true , primaryKey : true},
    name : { type : DataTypes.STRING , allowNull : false},
    color : {type : DataTypes.STRING , defaultValue : '#000000'}
} , {sequelize , modelName:'Tag'})