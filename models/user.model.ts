import { Model, DataTypes } from "sequelize";
import { sequelizeConfig } from "./sequelizeConfig.js";

class User extends Model { 
    id?: string;
    password?: string;
}

User.init(
    {
        id: {
            type: DataTypes.STRING,
            autoIncrement: false,
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING,
        },
    }, 
    { 
        sequelize: sequelizeConfig,
    }
)

export default User;