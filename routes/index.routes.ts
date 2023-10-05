import express from 'express';
import { authRoute } from './auth.routes';
import { fileRoute } from './file.routes';

export const routes = express.Router();

routes.use(authRoute);
routes.use(fileRoute);