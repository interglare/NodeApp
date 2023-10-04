import File from './file.model.js';
import User from './user.model.js';
import Sequelize from 'sequelize';
import { sequelizeConfig } from './sequelizeConfig.js';

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelizeConfig;

db.user = User;
db.file = File;

export default db;
