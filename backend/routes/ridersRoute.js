// routes/employeeRoutes.js
import express from "express";
import {
  addRider,
  getAllRiders,
  getRiderById,
  updateRider,
  deleteRider,
  approveRider,
  getPendingRiders,
  rejectRider,
} from "../controllers/ridersController.js";

const ridersRouter = express.Router();

ridersRouter.post("/add", addRider);
ridersRouter.get("/list", getAllRiders);
ridersRouter.get("/:id", getRiderById);
ridersRouter.post("/approve/:id", approveRider);
ridersRouter.get("/pending/list", getPendingRiders);
ridersRouter.post("/reject/:id", rejectRider);
ridersRouter.put("/:id", updateRider);
ridersRouter.delete("/:id", deleteRider);

export default ridersRouter;
