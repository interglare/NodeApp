import { Model, DataTypes } from "sequelize";
import { sequelizeConfig } from "./sequelizeConfig.js";

class File extends Model { }

File.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
        },
        extension: {
            type: DataTypes.STRING,
        },
        mimeType: {
            type: DataTypes.STRING,
        },
        size: {
            type: DataTypes.INTEGER,
        },
        createdDate: {
            type: DataTypes.DATE,
        },
    }, 
    {
        sequelize: sequelizeConfig,
    }
);

export default File;