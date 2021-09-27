import { Router } from  'express';
import multer from 'multer';
import multerConfig from './config/multer';
import User from './app/models/User';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import scheduleController from './app/controllers/scheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvaliableController from './app/controllers/avaliableController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users',UserController.store);

routes.post('/sessions',SessionController.store);

routes.use(authMiddleware);

routes.put('/users',UserController.update);

routes.get('/providers',ProviderController.index);

routes.post('/appointments', AppointmentController.store);

routes.get('/appointments', AppointmentController.index);

routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/providers/:providerId/avaliable', AvaliableController.index);

routes.get('/schedule', scheduleController.index);

routes.get('/notifications', NotificationController.index);

routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'),FileController.store);







export default routes;
