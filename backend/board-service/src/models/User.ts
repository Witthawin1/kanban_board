import { DataType , DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db"; 

export class User extends Model {
    public id! : number;
    public username! : string
    public email! : string
    public password_hash! : string
}

User.init({
    id : {type : DataTypes.INTEGER , autoIncrement : true, 
        primaryKey : true
    },
    username : {type : DataTypes.STRING , allowNull : false},
    email : {type : DataTypes.STRING , unique : true , allowNull : false},
    password_hash : { type: DataTypes.STRING, allowNull: false }
}, { sequelize, modelName: 'User'     
});
