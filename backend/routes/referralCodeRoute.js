// routes/referral.routes.js
import express from 'express';
import { generateReferralCode, verifyReferralCode } from '../controllers/referralCodeController.js';

const referralRouter = express.Router();

// Generate referral code
referralRouter.post('/generate', generateReferralCode);

// Verify referral code
referralRouter.post('/verify', verifyReferralCode);

export default referralRouter;