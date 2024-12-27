// src/routes/rider.routes.js
import express from "express";
import verifyRider from "../middleware/riderAuth.js";
import riderController from "../controllers/riderController.js";

const riderRouter = express.Router();

// Auth routes
riderRouter.post("/signup", riderController.signup);
riderRouter.post("/login", riderController.login);
riderRouter.post("/logout", verifyRider, riderController.logout);
riderRouter.get("/verify-token", verifyRider, riderController.verifyToken);

// Profile routes
riderRouter.get("/profile", verifyRider, riderController.getProfile);
riderRouter.put("/profile", verifyRider, riderController.updateProfile);
riderRouter.put("/location", verifyRider, riderController.updateLocation);

// Service routes
riderRouter.get("/services", verifyRider, riderController.getAssignedServices);
riderRouter.get(
	"/services/active",
	verifyRider,
	riderController.getActiveService
);
riderRouter.get(
	"/services/accepted",
	verifyRider,
	riderController.getAcceptedServices
);
riderRouter.put(
	"/services/:id/status",
	verifyRider,
	riderController.updateServiceStatus
);
riderRouter.get(
	"/services/history",
	verifyRider,
	riderController.getServiceHistory
);
riderRouter.post(
	"/services/:id/accept",
	verifyRider,
	riderController.acceptService
);
riderRouter.post(
	"/services/:id/complete",
	verifyRider,
	riderController.completeService
);

export default riderRouter;
