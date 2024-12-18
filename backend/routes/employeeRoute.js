// routes/employeeRoutes.js
import express from 'express';
import {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';

const employeeRouter = express.Router()

employeeRouter.post('/add', addEmployee);
employeeRouter.get('/list', getAllEmployees);
employeeRouter.get('/:id', getEmployeeById);
employeeRouter.put('/:id', updateEmployee);
employeeRouter.delete('/:id', deleteEmployee);

export default employeeRouter;