import express from 'express';
import { authRoute } from './auth.routes.js';
import { fileRoute } from './file.routes.js';

export const routes = express.Router();

routes.use(authRoute);
routes.use(fileRoute);