import { DataTypes , Model } from 'sequelize'
import { sequelize } from '../config/db'

export class BoardMember extends Model {
    public board_id! : number;
    public user_id! : number;
    public role! : string;
}

BoardMember.init({
    board_id : {type : DataTypes.INTEGER , primaryKey : true},
    user_id : {type: DataTypes.INTEGER , primaryKey : true},
    role : {type : DataTypes.STRING , defaultValue : 'member'}
} , {sequelize , modelName : 'BoardMember'})