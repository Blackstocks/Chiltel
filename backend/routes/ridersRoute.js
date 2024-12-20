// routes/employeeRoutes.js
import express from 'express';
import {
  addRider, getAllRiders, getRiderById, updateRider, deleteRider
} from '../controllers/ridersController.js';

const ridersRouter = express.Router()

ridersRouter.post('/add', addRider);
ridersRouter.get('/list', getAllRiders);
ridersRouter.get('/:id', getRiderById);
ridersRouter.put('/:id', updateRider);
ridersRouter.delete('/:id', deleteRider);

export default ridersRouter;