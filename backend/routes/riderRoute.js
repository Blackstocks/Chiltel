// src/routes/rider.routes.js
import express from "express";
import verifyRider from "../middleware/riderAuth.js";
import riderController from "../controllers/riderController.js";

const riderRouter = express.Router();

// Update the signup route to use the new middleware
riderRouter.post("/signup", riderController.signup);
riderRouter.post("/login", riderController.login);
riderRouter.post("/logout", verifyRider, riderController.logout);
riderRouter.get("/verify-token", verifyRider, riderController.verifyToken);

//payment routes
riderRouter.post("/create-order", riderController.createOrder);
riderRouter.post("/verify-payment", riderController.verifyPayment);
//recharge verify
riderRouter.post(
	"/verify-recharge",
	verifyRider,
	riderController.verifyPayment
);

//security deposit payment
riderRouter.post(
	"/create-deposit-order",
	riderController.createSecurityDepositOrder
);
riderRouter.post(
	"/verify-deposit-payment",
	verifyRider,
	riderController.verifySecurityDepositPayment
);

// Profile routes
riderRouter.get("/profile", verifyRider, riderController.getProfile);
riderRouter.put("/profile", verifyRider, riderController.updateProfile);
riderRouter.put("/location", riderController.updateLocation);

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
	"/services/:id/decline",
	verifyRider,
	riderController.declineService
);
// riderRouter.post(
// 	"/services/:id/complete",
// 	verifyRider,
// 	riderController.completeService
// );

riderRouter.post(
	"/services/:id/extra-works",
	verifyRider,
	riderController.addExtraWorks
);
riderRouter.post(
	"/services/:id/start",
	verifyRider,
	riderController.startService
);

riderRouter.post("/verify/bank", riderController.verifyBankDetails);
riderRouter.post("/verify/court", riderController.verifyCourtCase);

riderRouter.post(
	"/mark-attendance",
	verifyRider,
	riderController.markAttendance
);

riderRouter.get("/attendance", verifyRider, riderController.getAttendance);

riderRouter.post(
	"/services/:id/add-faults",
	verifyRider,
	riderController.addFaults
);

riderRouter.post(
	"/services/:id/add-repair",
	verifyRider,
	riderController.addRepairDetails
);

riderRouter.post(
	"/services/:id/send-otp",
	verifyRider,
	riderController.sendOTP
);

riderRouter.post(
	"/services/:id/verify-otp",
	verifyRider,
	riderController.verifyOTP
);

export default riderRouter;
