import File from './file.model';
import User from './user.model';
import Sequelize from 'sequelize';
import { sequelizeConfig } from './sequelizeConfig';

const db = {
    Sequelize: Sequelize,
    sequelize: sequelizeConfig,
    user: User,
    file: File,
};


export default db;
